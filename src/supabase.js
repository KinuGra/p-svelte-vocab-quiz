import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
let tmpRoomId;
let tmpUser;
let isTaisen = false;

export function taisenSet(){
    isTaisen = true;
}
export function getIsTaisen(){
    return isTaisen;
}
export function getRoomId(){
    return tmpRoomId;
}
export function getUser(){
    return tmpUser;
}

/** ongoingになるまでポーリング */
export async function pollUntilOngoing(roomId, user, callback) {
    tmpRoomId = roomId;
    tmpUser = user;
    const intervalId =window.setInterval(() => {
        getState(roomId, user).then(data => {
            console.log(data);
            if (data && data.state === "ongoing") {
                window.clearInterval(intervalId); // 状態が "ongoing" になったらポーリングを停止
                callback(); // コールバックを実行
            }
        }).catch(error => {
            if (error) {
                console.error(error);
                intervalId && window.clearInterval(intervalId); // エラーが発生した場合はポーリングを停止
                return;
            }
        })
    }, 100); // 0.1秒ごとに実行
}
/** finishになるまでポーリング */
export async function pollUntilFinish(roomId, user, callback) {
    const intervalId =window.setInterval(() => {
        getState(roomId, user).then(data => {
            console.log(data);
            if (data && data.state === "finish") {
                window.clearInterval(intervalId); // 状態が "finish" になったらポーリングを停止
                getScore(roomId, user).then(scoreData => {
                    callback(scoreData.score);
                })
            }
        }).catch(error => {
            if (error) {
                console.error(error);
                intervalId && window.clearInterval(intervalId); // エラーが発生した場合はポーリングを停止
                return;
            }
        })
    }, 1000); // 1秒ごとに実行
}

/** データベースからidsの行のtango, imiの抽出 */
export async function fetchTangoImiAsync(ids, mondaiDatabaseIndex){
    const { data, error } = await supabase
        .from(mondaiDatabaseIndex)
        .select('tango, imi')
        .in('id', ids);
    if (error) {
        console.error(error);
    }
    return data;
}

/** データベースのレコード数を取得 */
export async function fetchMondaisuAsync(mondaiDatabaseIndex){
    const { error, count } = await supabase
        .from(mondaiDatabaseIndex)
        .select('*', { count: 'exact', head: true});
    if (error) {
        console.error(error);
    }
    return count;
}

/** 名前、スコアをデータベースに書き込む */
export async function insertScoreAsync(name, score){
    const { error } = await supabase
        .from('Ranking')
        .insert({ name, score }); // name:name, score:scoreを省略
    if (error) {
        console.error(error);
    }
}

/** スコアの取得 */
export async function fetchRankingAsync(){
    const { data, error } = await supabase
        .from('Ranking')
        .select("score, name")
        .neq('name', '') // not equal : 空文字でないデータのみ取得
        .order('score', {ascending: false}) // 降順
        .limit(10); // 出力は最大10件
    if (error) {
        console.error(error);
    }
    return data;
}

/** ルーム作成（ルームが存在する場合は作成しない） */
export async function createRoomAsync(roomId) {
    // roomId が既に存在するか確認
    const { data, error: selectError } = await supabase
        .from('Room')
        .select('roomId')
        .eq('roomId', roomId)
        .limit(1);

    if (selectError) {
        console.error('Error checking room:', selectError.message);
        return null; // エラーが発生したら処理を中断
    }

    if (data.length > 0) { // 既にroomIdが存在する場合は処理しない
        console.log(`Room with roomId ${roomId} already exists. Skipping insert.`);
        return null;
    }

    // roomId が存在しない場合のみ挿入
    const { error: insertError } = await supabase
        .from('Room')
        .insert([{ roomId, user: "parent", state: "prepare", score: 0 }]);

    if (insertError) {
        console.error('Error inserting room:', insertError.message);
        return null;
    }

    console.log(`Room ${roomId} created successfully.`);
    return true; // 成功した場合は true を返す
}

/** ルーム参加 */
export async function searchRoomId(roomId) {
    const { data, error } = await supabase
        .from('Room') // テーブル名を指定
        .select('roomId') // すべてのカラムを取得（必要に応じてカラムを指定）
        .neq('roomId', '') // not equal : 空文字でないデータのみ取得
        .eq('roomId', roomId); // roomIdが一致するデータを取得
    if (error) {
        console.error('Error fetching rooms:', error)
        return null;
    }

    // データが存在するときのみ処理を実行
    if (data?.length) {
        return true;
    }
    console.log('一致する roomId が見つかりません');
    return false;
}

/** ルーム参加者のデータを追加 */
export async function insertChildDataAsync(roomId){
    const { error } = await supabase
        .from('Room')
        .insert({ roomId, user:"child", state:"ongoing", score:0 });
    if (error) {
        console.error(error);
    }
}

/** 対戦終了時のスコアの書き込み */
export async function updateRoomScoreAsync(roomId, user, score) {
    const { data, error } = await supabase
        .from('Room') // テーブル名
        .update({ score: score }) // 更新するカラムと値
        .eq('roomId', roomId) // 条件（roomIdが一致する行を更新）
        .eq('user', user);
    if (error) {
        console.error('Error updating room state:', error);
        return null;
    }

    console.log('Room state updated successfully:', data);
    return data;
}


// roomIdが一致する行のstateを更新する関数
export async function updateRoomStateAsync(roomId, user, newState) {
    const { data, error } = await supabase
        .from('Room') // テーブル名
        .update({ state: newState }) // 更新するカラムと値
        .eq('roomId', roomId) // 条件（roomIdが一致する行を更新）
        .eq('user', user);
    if (error) {
        console.error('Error updating room state:', error);
        return null;
    }

    console.log('Room state updated successfully:', data);
    return data;
}

/** 対戦クイズの状態を取得 */
export async function getState(roomId, user){
    const { data, error } = await supabase
        .from('Room') // テーブル名を指定
        .select('state') // すべてのカラムを取得（必要に応じてカラムを指定）
        .neq('roomId', '') // not equal : 空文字でないデータのみ取得
        .eq('roomId', roomId) // roomIdが一致するデータを取得
        .eq('user', user)
        .single();
    if (error) {
        console.error('Error fetching rooms:', error)
        return null;
    }
    return data;
}

/** 対戦クイズのスコアを取得 */
export async function getScore(roomId, user){
    const { data, error } = await supabase
        .from('Room') // テーブル名を指定
        .select('score') // すべてのカラムを取得（必要に応じてカラムを指定）
        .neq('roomId', '') // not equal : 空文字でないデータのみ取得
        .eq('roomId', roomId) // roomIdが一致するデータを取得
        .eq('user', user)
        .single();
    if (error) {
        console.error('Error fetching rooms:', error)
        return null;
    }
    return data;
}