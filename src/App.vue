<template>
    <div id="app">
        <PageHead/>
        <section class="form nes-container" style="text-align: center">
            <div v-if="step === 1" class="nes-field">
                <p>AH!!!</p>
                <p>It's you!!! Let me see what i can find for you!</p>
            </div>

            <div v-if="step === 2">
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

            <form v-if="step === 0" @submit.prevent="signCert">
                <div class="nes-field">
                    <p>Welcome to the VeChainThor world, i think you need to some magic to explore the world</p>
                </div>
                <div class="nes-field">
                    <button type="submit" class="nes-btn is-primary">Claim Token</button>
                </div>
            </form>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PageHead from './components/PageHead.vue';

@Component({
    components: {
        PageHead,
    },
})
export default class App extends Vue {
    public address = '';
    public loading = false;
    public msg = '';
    public isSuccess = false;
    public step = 0;

    public async postRequest(cert: Connex.Vendor.SigningService.CertResponse) {
        try {
            await fetch('https://faucet.outofgas.io/requests', {
                method: 'post',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                referrer: 'no-referrer',
                body: JSON.stringify(cert),
            });
        } catch (error) {
            return error.name + error.message;
        }
    }
    public async signCert() {
        this.step = 1;
        const signSvc = connex.vendor.sign('cert');
        try {
            const result = await signSvc.request({
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: '',
                },
            });
            this.postRequest(result);
        } catch (error) {
            this.step = 2;

            return error.name + error.message;
        }
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

