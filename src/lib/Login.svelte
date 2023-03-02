<script lang="ts">
    import { writable } from 'svelte/store'
    import { onMount } from 'svelte/internal'
    import { Session, SessionKit } from '@wharfkit/session'
    import { WebUIRenderer } from '@wharfkit/web-ui-renderer'
    import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet'

    const ui = new WebUIRenderer()
    const session = writable<Session | null>(null)

    const sessionKit = new SessionKit({
        appName: 'demo',
        chains: [
            {
                id: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
                url: 'https://wax.greymass.com',
                explorer: {
                    prefix: 'https://waxblock.io/transaction/',
                    suffix: '',
                },
            },
        ],
        ui,
        walletPlugins: [new WalletPluginCloudWallet()],
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
    <button class="primary" on:click={transact}>
        Test Transaction (No Broadcast)
    </button>
    <button on:click={logout}> Logout </button>
{:else}
    <button class="primary" on:click={login}> Login </button>
{/if}
