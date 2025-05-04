<script>
    import {fly} from 'svelte/transition';

    let currentScore = 0;
    let renzokuSeikai = 0;
    let showDelta = false;

    /** 回答時のスコアの更新 */
    export function updateScore(isCorrect){
        if(isCorrect){
            renzokuSeikai += 1;
            currentScore += renzokuSeikai;
            showDelta=true;
            setTimeout(()=>showDelta=false, 500);
        }
        else{
            renzokuSeikai = 0;
        }
    }

    /** スコアを返す */
    export function getScore(){
        return currentScore;
    }

    /** 連続正解数を返す */
    export function getRenzokuSeikai(){
        return renzokuSeikai;
    }
</script>

<div class="bg-blue-500/70 flex justify-around text-xl font-bold p-3">
    <div class="flex justify-start">
        <div>
            スコア:{currentScore}
            {#if showDelta}
                <span class="absolute ml-3 text-pink-500" out:fly={{y:-20}}>+{renzokuSeikai}</span>
            {/if}
        </div>
    </div>
    <div>連続正解数:{renzokuSeikai}</div>
</div>