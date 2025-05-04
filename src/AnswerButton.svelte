<script>
    export let isGrayout = false;
</script>

<button on:click 
    class="text-lg font-bold text-blue-50 border-blue-800 border-2 rounded-xl py-4 w-1/2"
    class:bg-gray-500={isGrayout} class:bg-blue-500={!isGrayout}>
    <slot></slot>
</button>
