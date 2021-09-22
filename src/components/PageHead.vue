<template>
    <header class="page-header">
        <div class="balance">
            <span>VET:</span>
            <span>{{vet}}</span>
        </div>
        <div class="balance">
            <span>VTHO:</span>
            <span>{{vtho}}</span>
        </div>
    </header>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageHeader extends Vue {
    public balance: null|string = null
    public energy: null|string = null
    private account = this.$connex.thor.account(
        '0x4f6FC409e152D33843Cf4982d414C1Dd0879277e'
    )

    get vet() {
        if (this.balance == null) {
            return '--'
        }
        return Math.round(parseInt(this.balance, 16) / 1e18).toLocaleString()
    }

    get vtho() {
        if (this.energy == null) {
            return '--'
        }
        return Math.round(parseInt(this.energy, 16) / 1e18).toLocaleString()
    }
    public async setBalance() {
        const theAccount = await this.account.get()
        this.balance = theAccount.balance
        this.energy = theAccount.energy
    }
    public async created() {
        this.setBalance()

        const ticker = this.$connex.thor.ticker()
        for (;;) {
            await ticker.next()
            await this.setBalance()
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
.balance {
    display: flex;
}
.balance span:first-of-type {
    width: 100px;
    padding-right: 10px;
    text-align: right;
}
.balance span:last-of-type {
    width: 220px;
    text-align: right;
}
</style>
