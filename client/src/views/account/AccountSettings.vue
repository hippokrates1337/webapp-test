<template>
    <div class="container">
        <div class="row d-flex justify-content-center">
            <div class="col-md-8 m-5 border p-3">
                <table class="table">
                    <tbody>
                        <tr>
                            <td>Benutzername: </td>
                            <td>{{ authStore.user ? authStore.user.name : '' }}</td>
                        </tr>
                        <tr>
                            <td>E-Mail: </td>
                            <td>{{ authStore.user ? authStore.user.email : '' }}</td>
                            <td><button class="btn btn-sm" @click="showEmailDialog"><i class="bi bi-pencil"></i></button></td>
                        </tr>
                        <tr>
                            <td>Passwort: </td>
                            <td>**********</td>
                            <td><button class="btn btn-sm" @click="showPwdDialog"><i class="bi bi-pencil"></i></button></td>
                        </tr>
                        <tr>
                            <td>Hinterlegte Verbraucher: </td>
                            <td>{{ consumerStore.consumers ? consumerStore.consumers.length : 0 }}</td>
                        </tr>
                        <tr>
                            <td>Hinterlegte Messwerte: </td>
                            <td>{{ datapointStore.datapoints ? datapointStore.datapoints.length : 0 }}</td>
                        </tr>
                    </tbody>
                </table>
                <button class="btn btn-danger"><i class="bi bi-trash3"></i> Konto löschen</button>
            </div>
        </div>
    </div>

    <ConfirmDialog :callback="changeEmail" :message="errorMsg" id="changeemail">
        <template v-slot:title>
            E-Mail-Adresse ändern
        </template>
        <template v-slot:body>
            <div class="form-floating mb-2">
                <input v-model="oldPwd" id="passwordOld" type="password" class="form-control" placeholder="XXX" required />
                <label for="passwordOld" class="form-label">Passwort</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="email" id="email" type="email" class="form-control" placeholder="Jjdoe@example.com" required />
                <label for="email" class="form-label">E-Mail</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="emailRepeat" id="emailRepeat" type="email" class="form-control" placeholder="Jjdoe@example.com" required />
                <label for="emailRepeat" class="form-label">E-Mail wiederholen</label>
            </div>
        </template>    
    </ConfirmDialog>

    <ConfirmDialog :callback="changePassword" :message="errorMsg" id="changepassword">
        <template v-slot:title>
            Passwort ändern
        </template>
        <template v-slot:body>
            <div class="form-floating mb-2">
                <input v-model="oldPwd" id="passwordOld" type="password" class="form-control" placeholder="XXX" required />
                <label for="passwordOld" class="form-label">Altes Passwort</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="newPwd" id="password" type="password" class="form-control" placeholder="XXX" required />
                <label for="password" class="form-label">Neues Passwort</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="newPwdRepeat" id="passwordRepeat" type="password" class="form-control" placeholder="XXX" required />
                <label for="passwordRepeat" class="form-label">Neues Passwort wiederholen</label>
            </div>
        </template>    
    </ConfirmDialog>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import * as bootstrap from 'bootstrap';
    import { useAuthStore } from '@/stores/authStore';
    import { useConsumerStore } from '@/stores/consumerStore';
    import { useDatapointStore } from '@/stores/datapointStore';
    import ConfirmDialog from '@/components/ConfirmDialog.vue';

    const authStore = useAuthStore();
    const consumerStore = useConsumerStore();
    const datapointStore = useDatapointStore();
    const oldPwd = ref('');
    const newPwd = ref('');
    const newPwdRepeat = ref('');
    const errorMsg = ref('');
    const email = ref('');
    const emailRepeat = ref('');

    onMounted(async () => {
        // Ensure data is loaded (but do not force an update)
        await consumerStore.load(false);
        await datapointStore.load(false);
    });

    const showEmailDialog = () => {
        const modal = bootstrap.Modal.getOrCreateInstance('#changeemail');
        modal.show();
    };

    const changeEmail = async () => {
        errorMsg.value = '';

        if(oldPwd.value == '') {
            errorMsg.value = 'Bitte Password eingeben';
        }

        if(email.value != emailRepeat.value) {
            errorMsg.value = 'Die E-Mail-Adressen stimmen nicht überein!';
        }

        const response = await authStore.changeEmail(oldPwd.value, email.value);
        if(response.status == 'failure') {
            errorMsg.value = response.message;
        } else {
            const modal = bootstrap.Modal.getOrCreateInstance('#changeemail');
            modal.hide();
        }
    };

    const showPwdDialog = () => {
        const modal = bootstrap.Modal.getOrCreateInstance('#changepassword');
        modal.show();
    };

    const changePassword = async () => {
        errorMsg.value = '';

        if(oldPwd.value == '') {
            errorMsg.value = 'Bitte das aktuelle Passwort eingeben';
        }

        if(newPwd.value != newPwdRepeat.value) {
            errorMsg.value = 'Die Passwörter stimmen nicht überein!';
        }

        const response = await authStore.changePwd(oldPwd.value, newPwd.value);
        if(response.status == 'failure') {
            errorMsg.value = response.message;
        } else {
            const modal = bootstrap.Modal.getOrCreateInstance('#confirmdialog');
            modal.hide();
        }
    };
</script>