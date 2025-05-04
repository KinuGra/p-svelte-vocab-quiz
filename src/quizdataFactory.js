import {fetchTangoImiAsync, fetchMondaisuAsync} from './supabase.js';

let EasyEWDB_mondaisu;
let EWDB_mondaisu;
const [EasyEWDB, EWDB] = ['EasyEnglishWords', 'EnglishWords']; // mondaiDatabaseIndex
let mondaiDatabaseIndex;
const [VeryEasy, Easy, Normal, Hard, VeryHard] = [0, 1, 2, 3, 4];
let takuID, tangoImi, seikai;

// EWDBの難易度ごとの区切り, ただしVeryHardはEWDBのテーブル数
let easyMondaiMondaisu = 20;
let normalMondaiMondaisu = 40;
let hardMondaiMondaisu = 70;
let qd; // quizDiffiulty

/** 0以上max未満の整数をランダムに選ぶ関数 */
function randomRange(max){
    return Math.floor(Math.random() * max);
}

/** min以上max以下の値を返す関数 */
function mRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 0以上max未満の整数を重複なくlen個をランダムに選ぶ関数 */
function randomArray(max, len){
    const array = [];
    while(array.length < len){
        let r;

        // より低い難易度の問題を表示させない
        // NormalからVeryHardまでに関してはmin以上、max以下の整数を重複なくlen個ランダムに選ぶ
        if(qd === Normal){
            r = mRandomRange(easyMondaiMondaisu+1, max);
        }else if(qd === Hard){
            r = mRandomRange(normalMondaiMondaisu+1, max);
        }else if(qd === VeryHard){
            r = mRandomRange(hardMondaiMondaisu-9, max)
        }else {
            r = randomRange(max);
        }

        if(!array.includes(r)){
            array.push(r);
        }
    }
    return array;
}

/** ランダムにquizdataを生成 */
export async function getQuizdataAsync(quizDifficulty){
    qd = quizDifficulty;
    if(quizDifficulty === VeryEasy){
        mondaiDatabaseIndex = EasyEWDB;

        // undefined OR nullであるときのみ呼び出す
        EasyEWDB_mondaisu ??= await fetchMondaisuAsync(mondaiDatabaseIndex);
    } else {
        mondaiDatabaseIndex = EWDB;

        // undefined OR nullであるときのみ呼び出す
        EWDB_mondaisu ??= await fetchMondaisuAsync(mondaiDatabaseIndex);
    }

    /** 選択肢の数 */
    const numberOfTaku = 5;

    // mondaiDatabaseIndexに応じてクイズデータの作成元を切り替え
    if(mondaiDatabaseIndex === EasyEWDB){
        takuID = randomArray(EasyEWDB_mondaisu, numberOfTaku);
        tangoImi = await fetchTangoImiAsync(takuID, mondaiDatabaseIndex);
        seikai = randomRange(numberOfTaku);
    } else if(mondaiDatabaseIndex === EWDB){
        switch(quizDifficulty){
            case Easy:
                takuID = randomArray(easyMondaiMondaisu, numberOfTaku);
                tangoImi = await fetchTangoImiAsync(takuID, mondaiDatabaseIndex);
                seikai = randomRange(numberOfTaku);
                break;
            case Normal:
                takuID = randomArray(normalMondaiMondaisu, numberOfTaku);
                tangoImi = await fetchTangoImiAsync(takuID, mondaiDatabaseIndex);
                seikai = randomRange(numberOfTaku);
                break;
            case Hard:
                takuID = randomArray(hardMondaiMondaisu, numberOfTaku);
                tangoImi = await fetchTangoImiAsync(takuID, mondaiDatabaseIndex);
                seikai = randomRange(numberOfTaku);
                break;
            case VeryHard:
                takuID = randomArray(EWDB_mondaisu - 1, numberOfTaku);
                tangoImi = await fetchTangoImiAsync(takuID, mondaiDatabaseIndex);
                seikai = randomRange(numberOfTaku);
                break;
            default:
                console.log("quizDifficulty is error");
                break;
        }
    }

    return {
        mondai: tangoImi[seikai].tango,
        seikai: tangoImi[seikai].imi,
        taku: tangoImi.map(({imi}) => imi)
    }
}