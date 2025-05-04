<script>
    import { createEventDispatcher } from 'svelte';
    import {insertScoreAsync} from './supabase.js';
    import {getScore, getRoomId, getUser} from "./supabase.js";

    const dispatch = createEventDispatcher();
    let modal;
    let score;
    let enemyScore;
    let name = "";

    export function showModal(currentScore, escore){
        score = currentScore;
        enemyScore = escore;
        name = localStorage.getItem("name") ?? ""; // nullが帰ってきたら空文字""を代入
        modal.showModal();
    }
    export function closeModal(){
        modal.close();
    }
    function okButtonClicked(){
        localStorage.setItem("name", name); // ブラウザに名前を保存
        insertScoreAsync(name, score);
        dispatch("click");

        console.log(getScore(getRoomId(), "child"));
        console.log(getScore(getRoomId(), "parent"));
    }

    // TODO スコアの評価の調整
    /** スコアに応じたメッセージとクラスを返す関数*/
    function getScoreMessage(score) {
    if (score <= 20) return { message: "Good"};
    if (score <= 40) return { message: "Great"};
    if (score <= 70) return { message: "Nice" };
    if (score <= 100) return { message: "Excellent"};
    return { message: "perfect", color: "text-red-500" };
    }
</script>

<dialog bind:this={modal} class="border rounded-xl backdrop-blur-sm bg-white/30 p-10">
    <div class="text-center text-gray-700 flex flex-col items-center gap-10">
        <div class="text-2xl font-extrabold">Time is Up!</div>
        <!-- スコアに応じたメッセージ表示 -->
        <div class="text-4xl font-semibold {getScoreMessage(score).color} font-bold">
            {getScoreMessage(score).message}
        </div>
        <div class="text-xl font-bold">
            スコア:{score}
        </div>
        <input bind:value={name} type="input" placeholder="名前の入力" class="p-3 border-none focus:outline-none rounded-xl w-full"/>
        <button on:click={okButtonClicked} class="text-xl w-1/2 border-2 border-gray-500 rounded-xl">OK</button>
        <div class="text-4xl font-extrabold">対戦結果</div>
        <div class="text-3xl font-extrabold">
            {#if score > enemyScore}
                勝ち
            {:else if score === enemyScore}
                引き分け
            {:else}
                負け
            {/if}
        </div>
        <div class="text-2xl font-bold">
            自分のスコア:{score}
        </div>
        <div class="text-2xl font-bold">
            相手のスコア:{enemyScore}
        </div>
    </div>
</dialog>