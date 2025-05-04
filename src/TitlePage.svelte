<script>
    import RankingModal from "./RankingModal.svelte";
    import CreateRoom from "./CreateRoom.svelte"
    import EnterRoom from "./EnterRoom.svelte";
    import { createEventDispatcher } from 'svelte';
    let rankingModal;
    let createRoom;
    let enterRoom;
    const dispatch = createEventDispatcher();
    const startSound = new Audio("/assets/sound/click.mp3")
    function showRanking(){
        startSound.play()
        rankingModal.showModal();
    }
    function showRoom(){
        startSound.play()
        createRoom.showModal();
    }
    function showEnterRoom(){
        startSound.play()
        enterRoom.showModal();
    }
    function handlePlayEvent(){
        dispatch("click");
    }
</script>

<div class="flex flex-col justify-center items-center h-svh gap-8">
    <div class="text-7xl font-extrabold backdrop-blur-sm bg-white/10 p-4 rounded-2xl">
        Quiz
    </div>
    <div class="text-4xl font-extrabold backdrop-blur-sm bg-white/20 p-3 px-6 rounded-xl">
        英単語で目指せハイスコア！
    </div>
    <button on:click class="bg-cyan-500 text-white font-bold text-3xl rounded-full border-2 p-4 w-1/2">
        スタート
    </button>
    <button on:click={showRoom} class="bg-cyan-500 text-white font-bold text-3xl rounded-full border-2 p-4 w-1/2">
        ルーム作成
    </button>
    <button on:click={showEnterRoom} class="bg-cyan-500 text-white font-bold text-3xl rounded-full border-2 p-4 w-1/2">
        ルーム参加
    </button>
    <button on:click={showRanking} class="bg-cyan-500 text-white font-bold text-3xl rounded-full border-2 p-4 w-1/2">
        ランキング
    </button>
</div>

<RankingModal bind:this={rankingModal}/>
<CreateRoom bind:this={createRoom} on:play={handlePlayEvent}/>
<EnterRoom bind:this={enterRoom} on:play={handlePlayEvent}/>