<script>
    import { onMount } from 'svelte'

    let products = []
    const options = {
        headers: {
            'Accept': 'application/json'
        }
    }

    onMount(async () => {
        products = await fetch(`/products`, options)
            .then(response => response.json())
    })

    async function handleChange(event) {
        if (event.target.value.length > 2) {
            products = await fetch(`/products?q=${event.target.value}`, options)
                .then(response => response.json())
        }
    }

</script>

<article>
    <p>
        Welcome to our website!
    </p>
    <h2>Our latest products</h2>
    <form>
        Type to filter: <input type="text" name="q" on:keyup={ handleChange }>
    </form>
    <ul>
        {#each products as product}
        <li><a href="/product/{ product.name }">{ product.name }</a></li>
        {/each}
    </ul>
</article>
