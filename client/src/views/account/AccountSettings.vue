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
                            <td><button class="btn btn-sm" @click="showDialog('email')"><i class="bi bi-pencil"></i></button></td>
                        </tr>
                        <tr>
                            <td>Passwort: </td>
                            <td>**********</td>
                            <td><button class="btn btn-sm" @click="showDialog('password')"><i class="bi bi-pencil"></i></button></td>
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

    <ConfirmDialog :callback="changeAttribute" :message="errorMsg" id="dialogemail">
        <template v-slot:title>
            E-Mail-Adresse ändern
        </template>
        <template v-slot:body>
            <div class="form-floating mb-2">
                <input v-model="password" id="pwdEmail" type="password" class="form-control" placeholder="XXX" required />
                <label for="pwdEmail" class="form-label">Passwort</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="newValue" id="email" type="email" class="form-control" placeholder="Jjdoe@example.com" required />
                <label for="email" class="form-label">E-Mail</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="newValueRepeat" id="emailRepeat" type="email" class="form-control" placeholder="Jjdoe@example.com" required />
                <label for="emailRepeat" class="form-label">E-Mail wiederholen</label>
            </div>
        </template>    
    </ConfirmDialog>

    <ConfirmDialog :callback="changeAttribute" :message="errorMsg" id="dialogpassword">
        <template v-slot:title>
            Passwort ändern
        </template>
        <template v-slot:body>
            <div class="form-floating mb-2">
                <input v-model="password" id="pwdPassword" type="password" class="form-control" placeholder="XXX" required />
                <label for="pwdPassword" class="form-label">Altes Passwort</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="newValue" id="password" type="password" class="form-control" placeholder="XXX" required />
                <label for="password" class="form-label">Neues Passwort</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="newValueRepeat" id="passwordRepeat" type="password" class="form-control" placeholder="XXX" required />
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
    const password = ref('');
    const newValue = ref('');
    const newValueRepeat = ref('');
    const errorMsg = ref('');
    const attributeToChange = ref('');

    onMounted(async () => {
        // Ensure data is loaded (but do not force an update)
        await consumerStore.load(false);
        await datapointStore.load(false);
    });

    const showDialog = (attribute) => {
        attributeToChange.value = attribute;

        const modal = bootstrap.Modal.getOrCreateInstance('#dialog' + attribute);
        modal.show();

        const modalEl = document.getElementById('dialog' + attribute);
        modalEl.addEventListener('hidden.bs.modal', () => {
            password.value = '';
            newValue.value = '';
            newValueRepeat.value = '';
            errorMsg.value = '';
        });
    };

    const changeAttribute = async () => {
        let change = {}
        errorMsg.value = '';

        if(password.value == '') {
            errorMsg.value = 'Bitte Password eingeben';
        } else if(newValue.value != newValueRepeat.value) {
            errorMsg.value = 'Die neuen Werte stimmen nicht überein!';
        } else {
            change['attribute'] = attributeToChange.value;
            change[attributeToChange.value] = newValue.value;
            change['pwd'] = password.value;

            const response = await authStore.changeAttribute(change);
            if(response.status == 'failure') {
                errorMsg.value = response.message;
            } else {
                const modal = bootstrap.Modal.getOrCreateInstance('#dialog' + attributeToChange.value);
                modal.hide();

                password.value = '';
                newValue.value = '';
                newValueRepeat.value = '';
                errorMsg.value = '';
            }
        }
    };
</script>