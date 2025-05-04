<script>
    import { createEventDispatcher } from 'svelte';
    import {createRoomAsync, pollUntilOngoing, taisenSet, pollUntilFinish, getScore} from './supabase.js';

    const dispatch = createEventDispatcher();
    let modal;
    let roomId = "";

    export function showModal(){
        modal.showModal();
    }
    export function closeModal(){
        modal.close();
    }
    function okButtonClicked(){
        taisenSet(); // supabase.jsのisTaiseをtrueにセット
        createRoomAsync(roomId);
        dispatch("click");
        pollUntilOngoing(roomId,"parent", () => {
                modal.close()
                dispatch("play");
        })
        localStorage.setItem("roomId", roomId);
        localStorage.setItem("user", "parent");
    }
</script>

<dialog bind:this={modal} class="border rounded-xl backdrop-blur-sm bg-white/30 p-10">
    <div class="text-center text-gray-700 flex flex-col items-center gap-10">
        <div class="text-2xl font-extrabold">ルーム作成</div>
        <!-- <div class="text-xl font-bold"> -->
        <!-- 表示したいものがあればここに -->
        <!-- </div> -->
        <input bind:value={roomId} type="input" placeholder="あいことばを入力" class="p-3 border-none focus:outline-none rounded-xl w-full"/>
        <button on:click={okButtonClicked} class="text-xl w-1/2 border-2 border-gray-500 rounded-xl">OK</button>
    </div>
</dialog>