<template>
    <div class="card m-3">
        <h4 class="card-header">Anmelden</h4>
        <div class="card-body">
            <form>
                <div class="form-group">
                    <label>Benutzername</label>
                    <input name="username" type="text" class="form-control" />
                </div>
                <button @click="onSubmit">Anmelden</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    const onSubmit = (values) => {
        console.log(values);
    }
</script>