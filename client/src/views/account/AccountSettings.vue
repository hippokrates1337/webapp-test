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
                            <td><button class="btn btn-sm" @click="showAttributeChangeDialog('email')"><i class="bi bi-pencil"></i></button></td>
                        </tr>
                        <tr>
                            <td>Passwort: </td>
                            <td>**********</td>
                            <td><button class="btn btn-sm" @click="showAttributeChangeDialog('password')"><i class="bi bi-pencil"></i></button></td>
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
                <button class="btn btn-danger" @click="showDeleteAccountDialog"><i class="bi bi-trash3"></i> Konto löschen</button>
            </div>
        </div>
    </div>

    <ConfirmDialog :callback="changeAttribute" :message="errorMsg" id="dialogattribute">
        <template v-slot:title>
            {{ attributeToChange == 'email' ? 'E-Mail-Adresse ' : 'Passwort ' }} ändern
        </template>
        <template v-slot:body>
            <div class="form-floating mb-2">
                <input v-model="password" id="pwdEmail" type="password" class="form-control" placeholder="XXX" required />
                <label for="pwdEmail" class="form-label">Passwort</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="newValue" id="newValue" :type="attributeToChange == 'email' ? 'email' : 'password'" class="form-control" placeholder="Jjdoe@example.com" />
                <label for="newValue" class="form-label">{{ attributeToChange == 'email' ? 'E-Mail-Adresse' : 'Passwort' }}</label>
            </div>
            <div class="form-floating mb-2">
                <input v-model="newValueRepeat" id="newValueRepeat" :type="attributeToChange == 'email' ? 'email' : 'password'" class="form-control" placeholder="Jjdoe@example.com" />
                <label for="newValueRepeat" class="form-label">{{ attributeToChange == 'email' ? 'E-Mail-Adresse ' : 'Passwort ' }} wiederholen</label>
            </div>
        </template>    
    </ConfirmDialog>

    <ConfirmDialog :callback="deleteAccount" :message="errorMsg" id="dialogdelete">
        <template v-slot:title>
            Benutzerkonto löschen
        </template>
        <template v-slot:body>
            <p class="text-danger">
                Die Löschung Deines Benutzerkontos ist unwiderruflich. Es werden auch alle Deine hinterlegten
                Verbraucher und Messwerte entfernt. Wenn Du dies wirklich tun möchtest, gib bitte unten Dein Password ein.
            </p>
            <div class="form-floating mb-2">
                <input v-model="password" id="pwdEmail" type="password" class="form-control" placeholder="XXX" required />
                <label for="pwdEmail" class="form-label">Passwort</label>
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

    const showAttributeChangeDialog = (attribute) => {
        attributeToChange.value = attribute;

        const modal = bootstrap.Modal.getOrCreateInstance('#dialogattribute');
        modal.show();

        const modalEl = document.getElementById('dialogattribute');
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
                const modal = bootstrap.Modal.getOrCreateInstance('#dialogattribute');
                modal.hide();

                password.value = '';
                newValue.value = '';
                newValueRepeat.value = '';
                errorMsg.value = '';
            }
        }
    };

    const showDeleteAccountDialog = () => {
        const modal = bootstrap.Modal.getOrCreateInstance('#dialogdelete');
        modal.show();

        const modalEl = document.getElementById('dialogdelete');
        modalEl.addEventListener('hidden.bs.modal', () => {
            password.value = '';
            errorMsg.value = '';
        });
    };

    const deleteAccount = async () => {
        errorMsg.value = '';

        if(password.value == '') {
            errorMsg.value = 'Bitte Password eingeben';
        } else {
            const response = await authStore.deleteAccount(password.value);
            if(response.status == 'failure') {
                errorMsg.value = response.message;
            } else {
                const modal = bootstrap.Modal.getOrCreateInstance('#dialogdelete');
                modal.hide();

                password.value = '';
                errorMsg.value = '';
            }
        }
    }
</script>