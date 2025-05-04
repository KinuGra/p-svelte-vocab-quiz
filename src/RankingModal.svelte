<script>
    import { fetchRankingAsync } from "./supabase.js";

    let modal;
    let rankingPromise;

    export function showModal(){
        rankingPromise = fetchRankingAsync();
        modal.showModal();
    }
</script>

<dialog bind:this={modal} class="border rounded-xl   backdrop-blur-sm bg-white/30 p-10">
    <div class="text-center test-gray-700 flex flex-col items-center gap-5">
        <div class="text-2xl font-extrabold">ランキング</div>
        {#if rankingPromise}
            {#await rankingPromise}
                読み込み中
            {:then rankingData}
                <table class="w-fit table-auto">
                    <thead>
                        <tr>
                            <th class="px-3">#</th>
                            <th class="px-6">名前</th>
                            <th class="px-6">スコア</th>
                        </tr>
                    </thead>
                    <tbody>
                    {#each rankingData as {name, score}, i}
                        <tr>
                            <td>{i+1}</td><td>{name}</td><td>{score}</td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            {/await}
            <button on:click={()=>modal.close()} class="text-xl w-1/2 border-2 border-gray-500 rounded-xl">OK</button>
        {/if}
    </div>
</dialog>