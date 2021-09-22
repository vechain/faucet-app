<template>
    <div id="app">
        <PageHead/>
        <section class="form nes-container" style="text-align: center">
            <div v-if="step === status.confirm.step" class="nes-field">
                <p>AH!!!</p>
                <p>its you !!! let me see what I can find for you !</p>
            </div>

            <div class="step-2" v-if="step === status.ask.step">
                <a @click="reset" href="javascript:;" class="frame-close">
                    <i class="nes-icon close"></i>
                </a>
                <div class="nes-field">
                    <p>Well...well...well...... My mom doesn't let me talk to stranger..... Unless you tell me who you are</p>
                </div>
                <div class="nes-field">
                    <button @click="signCert" class="nes-btn">It's me!!!</button>
                </div>
            </div>

            <div v-if="step === status.tryAgain.step">
                <div class="nes-field">
                    <p>It seems something wrong here</p>
                </div>
                <div class="nes-field">
                    <button @click="signCert" class="nes-btn">Try again</button>
                </div>
            </div>

            <div v-if="step === status.reAsk.step">
                <div class="nes-field">
                    <p>The certificate is expired, I am not sure who you are...</p>
                </div>
                <div class="nes-field">
                    <button @click="signCert" class="nes-btn">It's me!!!</button>
                </div>
            </div>

            <div v-if="step === status.outOfLimitL.step">
                <div class="nes-field">
                    <p>Greed is good! BUT save some for others! Come back tomorrow.</p>
                </div>
            </div>

            <div
                v-if="step === status.insufficient.step"
            >Unfortunately I unable to give you some coins to explore because I do not have sufficient balance. Please come back later and try again!</div>

            <div class="step-5" v-if="step === status.success.step">
                <a @click="reset" href="javascript:;" class="frame-close">
                    <i class="nes-icon close"></i>
                </a>
                <div class="nes-field">
                    <p>
                        I found this!!! TXID:
                        <a
                            :href="`https://insight.vecha.in/#/test/txs/${txid}`"
                            target="_blank"
                        >{{shortTxid}}</a>, good luck on your journey!!
                    </p>
                    <button @click="reset" class="nes-btn">See you soon!</button>
                </div>
            </div>

            <form v-if="step === status.start.step" @submit.prevent="signCert">
                <div class="nes-field">
                    <p>Welcome to the VeChain world, I think you need some tokens to explore the world</p>
                </div>
                <div class="nes-field">
                    <button type="submit" class="nes-btn is-primary">Claim Tokens</button>
                </div>
            </form>
        </section>
        <PageFoot />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PageHead from './components/PageHead.vue'
import PageFoot from './components/PageFoot.vue'
import status from './status'

@Component({
    components: {
        PageHead,
        PageFoot,
    },
})
export default class App extends Vue {
    public address = ''
    public loading = false
    public msg = ''
    public isSuccess = false
    public status = status
    public step = this.status.start.step
    private txid = ''
    private respError = ''

    get shortTxid() {
        return !this.txid
            ? ''
            : this.txid.substr(0, 6) + '......' + this.txid.substr(60, 66)
    }

    public async postRequest(
        content: Connex.Vendor.CertMessage & Connex.Vendor.TxResponse
    ) {
        try {
            const resp = await fetch(
                'https://valve.outofgas.io/requests',
                {
                    method: 'post',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    referrer: 'no-referrer',
                    body: JSON.stringify(content),
                }
            )
            if (
                resp.status === 200 &&
                resp.headers.get('content-type')!.includes('application/json')
            ) {
                const body = await resp.json()
                this.txid = body.id
                this.step = status.success.step
            } else {
                if (resp.status === 403) {
                    const body = await resp.json()
                    const code = body.type
                    if (code === 400 || code === 401) {
                        this.step = this.status.reAsk.step
                    } else if (code === 402 || code === 403) {
                        this.step = this.status.insufficient.step
                    } else if (code === 404 || code === 405) {
                        this.step = this.status.outOfLimitL.step
                    } else if (code === 300 || code === 301) {
                        this.step = this.status.tryAgain.step
                    } else {
                        throw new Error('unknow error')
                    }
                } else {
                    throw new Error('unknow error')
                }
            }
        } catch (error) {
            this.step = this.status.tryAgain.step
        }
    }
    public reset() {
        this.step = this.status.start.step
    }
    public async signCert() {
        let result: any
        const msg: Connex.Vendor.CertMessage = {
            purpose: 'identification',
            payload: {
                type: 'text',
                content: `Before signing a certificate of identification, the faucet is unable to send you test tokens because faucet does not know your identity. The ONLY way to know your identity is requesting you to sign the certificate of identification. Once the certificate is signed, Faucet is able to send you tokens.

Select a wallet  which you would like to receive the tokens`,
            },
        }
        const signSvc = this.$connex.vendor.sign('cert', msg)
        try {
            result = await signSvc.request()
            this.step = this.status.confirm.step
        } catch (error) {
            this.step = this.status.ask.step
            return
        }

        const token = await this.$recaptcha('claim')

        this.postRequest({ ...result, ...msg, token })
    }
}
</script>

<style>
html,
body {
    width: 100%;
    padding: 0;
    margin: 0;
    height: 100%;
    position: relative;
    line-height: 30px;
}
#app {
    /* -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: 60px; */
    position: absolute;
    top: -100px;
    left: 0;
    right: 0;
    bottom: 0;
    /* padding: 40px 80px; */
    margin: auto;
    width: 80%;
    height: 200px;
}
.actions {
    text-align: right;
    margin-top: 20px;
}
.step-2,
.step-5 {
    padding-top: 30px;
}
.frame-close {
    position: absolute;
    top: -44px;
    right: 2px;
    display: flex;
    padding: 5px;
    border: 4px solid #000;
    border-radius: 3px;
}

.frame-close:hover .nes-icon.close::before {
    color: white;
}
.frame-close:hover {
    color: white;
    background-color: black;
}
.sync-link:hover,
.sync-link {
    color: rgb(124, 195, 35);
    text-decoration: none;
    font-size: 24px;
}
@media (min-width: 800px) {
    #app {
        padding: 0 40px;
        width: 90%;
    }
}

@media (min-width: 1200px) {
    #app {
        width: 70%;
    }
}

@media (min-width: 1440px) {
    #app {
        width: 60%;
    }
}
</style>

