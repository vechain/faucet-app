<template>
    <header class="page-header">
        <div>
            VET: {{vet}}
            VTHO: {{vtho}}
        </div>
    </header>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PageHeader extends Vue {
    public balance = '0x0';
    public energy = '0x0';

    get vet() {
        const result = parseInt(this.balance, 16) / 1e18;

        return result.toLocaleString();
    }

    get vtho() {
        const result = parseInt(this.energy, 16) / 1e18;

        return result.toLocaleString();
    }

    public async created() {
        const ticker = connex.thor.ticker();
        const account = connex.thor.account('0x4f6FC409e152D33843Cf4982d414C1Dd0879277e');
        for (; ;) {
            await ticker.next();
            const theAccount = await account.get();
            this.balance = theAccount.balance;
            this.energy = theAccount.energy;
        }
    }
}
</script>

<style>
.page-header {
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    padding: 10px 20px;
}
</style>
