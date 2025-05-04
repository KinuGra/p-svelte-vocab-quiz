<script>
    import { createEventDispatcher } from 'svelte';
    import {pollUntilOngoing, insertChildDataAsync, searchRoomId, updateRoomStateAsync, pollUntilFinish, taisenSet, getScore} from './supabase.js';
    import { SvelteURLSearchParams } from 'svelte/reactivity';

    const dispatch = createEventDispatcher();
    let modal;
    export let roomId = "";

    export function showModal(){
        modal.showModal();
    }
    export function closeModal(){
        modal.close();
    }
    /** 参加者をデータベースに追加し、stateを更新 */
    async function okButtonClicked(){
        taisenSet(); // supabase.jsのisTaiseをtrueにセット
        if(await searchRoomId(roomId)){
            dispatch("click");
            // modal.close();
            // pollUntilOngoing(roomId,"child", () => {
            //     modal.close()
            // });
            insertChildDataAsync(roomId);
            updateRoomStateAsync(roomId, "parent", "ongoing");
            /** ongoingになるまでポーリング */
            pollUntilOngoing(roomId,"child", () => {
                modal.close()
                dispatch("play");
            });
            localStorage.setItem("roomId", roomId);
            localStorage.setItem("user", "child");
        } else{
            dispatch("click");
            modal.close();
        }
    }
</script>

<dialog bind:this={modal} class="border rounded-xl backdrop-blur-sm bg-white/30 p-10">
    <div class="text-center text-gray-700 flex flex-col items-center gap-10">
        <div class="text-2xl font-extrabold">ルーム参加</div>
        <!-- <div class="text-xl font-bold"> -->
        <!-- 表示したいものがあればここに -->
        <!-- </div> -->
        <input bind:value={roomId} type="input" placeholder="あいことばを入力" class="p-3 border-none focus:outline-none rounded-xl w-full"/>
        <button on:click={okButtonClicked} class="text-xl w-1/2 border-2 border-gray-500 rounded-xl">OK</button>
    </div>
</dialog>