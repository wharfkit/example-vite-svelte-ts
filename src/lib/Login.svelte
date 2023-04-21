<script lang="ts">
    import { writable } from 'svelte/store'
    import { onMount } from 'svelte/internal'
    import { Session, SessionKit } from '@wharfkit/session'
    import { WebRenderer } from '@wharfkit/web-renderer'
    import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor'
    import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet'

    const ui = new WebRenderer()
    const session = writable<Session | null>(null)

    const sessionKit = new SessionKit({
        appName: 'demo',
        chains: [
            {
                id: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
                url: 'https://eos.greymass.com',
                explorer: {
                    prefix: 'https://bloks.io/transaction/',
                    suffix: '',
                },
            },
            {
                id: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
                url: 'https://telos.greymass.com',
                explorer: {
                    prefix: 'https://explorer.telos.net/transaction/',
                    suffix: '',
                },
            },
            {
                id: '8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02',
                url: 'https://api.uxnetwork.io',
                explorer: {
                    prefix: 'https://explorer.uxnetwork.io/tx/',
                    suffix: '',
                },
            },
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
        walletPlugins: [
            new WalletPluginAnchor(),
            new WalletPluginCloudWallet(),
        ],
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
