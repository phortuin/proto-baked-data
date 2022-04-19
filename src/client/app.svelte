<script>
    import { onMount } from 'svelte'

    let products = []

    onMount(async () => {
        products = await fetch(`/product.json`)
            .then(response => response.json())
    })

    async function handleChange(event) {
        if (event.target.value.length > 2) {
            products = await fetch(`/product.json?q=${event.target.value}`)
                .then(response => response.json())
        }
    }

</script>

<article>
    <form>
        <h1>Meen ik true</h1>
        <input type="text" name="q" on:keyup={ handleChange }>
    </form>
    <ul>
        {#each products as product}
        <li>{ product.name }</li>
        {/each}
    </ul>
</article>
