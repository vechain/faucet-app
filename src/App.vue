<template>
    <div id="app">
        <PageHead v-if="hasConnex && isTestNet"/>
        <section v-if="!hasConnex" class="nes-container with-title">
            <h2 class="title">Connex not detected</h2>
            <p>
                It's recommended to open in
                <span
                    style="color: rgb(42, 64, 163); font-size: 24px"
                >VeChain Sync</span>.
            </p>
            <div>
                <a @click="openSync" href="javascript:;" class="sync-link">Open</a> or
                <a :href="syncReleaseUrl" class="sync-link">Download</a> VeChain Sync.
            </div>
        </section>
        <section
            v-if="!isTestNet"
            class="nes-container with-title"
        >Faucet is only available in testnet.</section>
        <section
            v-if="hasConnex && isTestNet"
            class="form nes-container"
            style="text-align: center"
        >
            <div v-if="step === 1" class="nes-field">
                <p>AH!!!</p>
                <p>It's you!!! Let me see what i can find for you!</p>
            </div>

            <div class="step-2" v-if="step === 2">
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

            <div v-if="step === 3">
                <div class="nes-field">
                    <p>It seems something wrong here</p>
                </div>
                <div class="nes-field">
                    <button @click="signCert" class="nes-btn">Try again</button>
                </div>
            </div>

            <div v-if="step === 4">
                <div class="nes-field">
                    <p>The certificate is expired, I am not sure who you are...</p>
                </div>
                <div class="nes-field">
                    <button @click="signCert" class="nes-btn">It's me!!!</button>
                </div>
            </div>

            <div v-if="step === 4.1">
                <div class="nes-field">
                    <p>Greed is good! BUT save some for others! Come back tomorrow.</p>
                </div>
            </div>

            <div class="step-5" v-if="step === 5">
                <a @click="reset" href="javascript:;" class="frame-close">
                    <i class="nes-icon close"></i>
                </a>
                <div class="nes-field">
                    <p>
                        I found this!!! TXID:
                        <a
                            :href="`https://insight.vecha.in/#/txs/${txid}`"
                            target="_blank"
                        >{{txid}}</a>, good luck on your joruney!!
                    </p>
                    <button @click="reset" class="nes-btn">Bye! See you soon!</button>
                </div>
            </div>

            <form v-if="step === 0" @submit.prevent="signCert">
                <div class="nes-field">
                    <p>Welcome to the VeChainThor world, i think you need to some magic to explore the world</p>
                </div>
                <div class="nes-field">
                    <button type="submit" class="nes-btn is-primary">Claim Token</button>
                </div>
            </form>
        </section>
        <PageFoot/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PageHead from './components/PageHead.vue';
import PageFoot from './components/PageFoot.vue';

@Component({
    components: {
        PageHead,
        PageFoot,
    },
})
export default class App extends Vue {
    public address = '';
    public loading = false;
    public msg = '';
    public isSuccess = false;
    public step = 0;
    private syncReleaseUrl = `https://github.com/vechain/thor-sync.electron/releases`;
    private txid = '';
    private respError = '';

    private hasConnex = window.connex && window.connex.vendor;
    private isTestNet = true;

    public async created() {
        if (this.hasConnex) {
            this.isTestNet = await this.checkNet();
        }
    }

    public openSync() {
        const customProtocolDetection = require('custom-protocol-detection');
        const vechainAppUrl = 'vechain-app:///' + encodeURIComponent(window.location.href);
        const gotoDownload = () => {
            window.location.href = this.syncReleaseUrl;
        };
        customProtocolDetection(vechainAppUrl, () => {
            gotoDownload();
        }, () => {
            // TODO Open with sync
        }, () => {
            gotoDownload();
        });
    }

    public async checkNet() {
        const block = connex.thor.block(0);
        const firstBlock = await block.get();
        return firstBlock!.id === '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127';
    }

    public async postRequest(cert: Connex.Vendor.SigningService.CertResponse) {
        try {
            const resp = await fetch('https://faucet.outofgas.io/requests', {
                method: 'post',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                referrer: 'no-referrer',
                body: JSON.stringify(cert),
            });
            if (resp.status === 200 && resp.headers.get('content-type')!.includes('application/json')) {
                const body = await resp.json();
                this.txid = body.id;
                this.step = 5;
            } else {
                if (resp.status === 403) {
                    const body = await resp.text();
                    if (body) {
                        this.step = 4.1;
                    } else {
                        this.step = 4;
                    }
                } else {
                    throw new Error('unknow error');
                }
            }

        } catch (error) {
            this.step = 3;
        }
    }
    public reset() {
        this.step = 0;
    }
    public async signCert() {
        const signSvc = connex.vendor.sign('cert');
        let result: any;
        try {
            result = await signSvc.request({
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content:
                        `Before signing a certificate of identification, the faucet is unable to send you test tokens because faucet does not know your identity. The ONLY way to know your identity is requesting you to sign the certificate of identification. Once the certificate is signed, Faucet is able to send you the tokens.

Select a wallet  which you would like to receive the tokens`,
                },
            });
            this.step = 1;
        } catch (error) {
            this.step = 2;
            return;
        }

        this.postRequest(result);
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

