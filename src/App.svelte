<script lang="ts">
    import svelteLogo from './assets/svelte.svg'
    import wharfLogo from './assets/wharf.svg'
    import Login from './lib/Login.svelte'
</script>

<main>
    <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" class="logo" alt="Vite Logo" />
        </a>
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">
            <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
        </a>
        <a href="https://wharfkit.com" target="_blank" rel="noreferrer">
            <img src={wharfLogo} class="logo wharf" alt="Wharf Logo" />
        </a>
    </div>
    <h1>Vite + Svelte + Wharf</h1>

    <div class="card">
        <Login />
    </div>

    <p>
        Check out <a
            href="https://github.com/sveltejs/kit#readme"
            target="_blank"
            rel="noreferrer">SvelteKit</a
        >, the official Svelte app framework powered by Vite!
    </p>

    <p class="read-the-docs">
        Click on the Vite, Svelte, and Wharf logos to learn more
    </p>
</main>

<style>
    .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;
    }
    .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.svelte:hover {
        filter: drop-shadow(0 0 2em #ff3e00aa);
    }
    .logo.wharf:hover {
        filter: drop-shadow(0 0 2em #1cb095);
    }
    .read-the-docs {
        color: #888;
    }
</style>
