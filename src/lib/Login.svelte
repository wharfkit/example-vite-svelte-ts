<script lang="ts">
    import { writable } from 'svelte/store'
    import { onMount } from 'svelte/internal'
    import { Chains, Session, SessionKit } from '@wharfkit/session'
    import { WebRenderer } from '@wharfkit/web-renderer'
    import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor'

    const ui = new WebRenderer()
    const session = writable<Session | null>(null)

    const sessionKit = new SessionKit({
        appName: 'demo',
        chains: [Chains.Jungle4],
        ui,
        walletPlugins: [new WalletPluginAnchor()],
    })

    onMount(async () => {
        try {
            const restored = await sessionKit.restore()
            console.log(restored)
            if (restored) {
                session.set(restored)
            }
        } catch (e) {
            console.log('error caught in onMount', e)
        }
    })

    async function login() {
        const response = await sessionKit.login()
        $session = response.session
    }

    async function logout() {
        await sessionKit.logout($session)
        $session = null
    }

    async function transact() {
        const action = {
            account: 'eosio.token',
            name: 'transfer',
            authorization: [$session.permissionLevel],
            data: {
                from: $session.actor,
                to: 'teamgreymass',
                quantity: '0.00000001 WAX',
                memo: 'Yay WharfKit! Thank you <3',
            },
        }
        $session.transact({ action }, { broadcast: false }).catch((e) => {
            console.log('error caught in transact', e)
        })
    }
</script>

{#if $session}
    <p>Logged in as {$session.actor}</p>
    <button class="primary" on:click={transact}>
        Test Transaction (No Broadcast)
    </button>
    <button on:click={logout}> Logout </button>
{:else}
    <button class="primary" on:click={login}> Login </button>
{/if}
