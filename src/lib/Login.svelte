<script lang="ts">
    import { writable } from 'svelte/store'
    import { onMount } from 'svelte/internal'
    import {
        Chains,
        PlaceholderName,
        Session,
        SessionKit,
    } from '@wharfkit/session'
    import { Contract, ContractKit } from '@wharfkit/contract'
    import { WebRenderer } from '@wharfkit/web-renderer'
    import { TransactPluginResourceProvider } from '@wharfkit/transact-plugin-resource-provider'
    import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor'
    import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet'
    import { WalletPluginWombat } from '@wharfkit/wallet-plugin-wombat'

    const ui = new WebRenderer()
    const session = writable<Session | null>(null)
    const account = writable<Account | null>(null)
    const contract = writable<Contract | null>(null)

    const sessionKit = new SessionKit(
        {
            appName: 'demo',
            chains: [Chains.WAX],
            ui,
            walletPlugins: [
                new WalletPluginAnchor(),
                new WalletPluginCloudWallet(),
                new WalletPluginWombat(),
            ],
        },
        {
            transactPlugins: [new TransactPluginResourceProvider()],
        }
    )

    onMount(async () => {
        try {
            const restored = await sessionKit.restore()
            if (restored) {
                session.set(restored)
                const contractKit = new ContractKit({
                    client: restored.client,
                })
                contract.set(await contractKit.load('eosio'))
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

    async function test() {
        $session.transact({
            action: $contract.action('claimgbmvote', {
                owner: PlaceholderName,
            }),
        })
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
        $session.transact({ action }, { broadcast: false })
    }
</script>

{#if $session}
    {#if $account}
        <p>{$account.accountName}</p>
    {/if}
    <button class="primary" on:click={test}> claimgmbvote </button>
    <button class="primary" on:click={transact}>
        Test Transaction (No Broadcast)
    </button>
    <button on:click={logout}> Logout </button>
{:else}
    <button class="primary" on:click={login}> Login </button>
{/if}
