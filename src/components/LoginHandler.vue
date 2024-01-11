<template>
    <div class="loading loading-spinner loading-lg">xd</div>
</template>

<script setup lang="ts">

/* axios.get(`${import.meta.env.VITE_API_BASE_URL}/`, {
    withCredentials: false,
    maxRedirects: 0,
}).then(res => {
    console.log(res);
})
 */
fetch(`${import.meta.env.VITE_API_BASE_URL}/`, {
    credentials: 'include',
    redirect: 'manual'
}).then(async res => {
    console.log(res);
    const status = res.status;
    const json = await res.json();
    if (status === 401) {
        // redirect to steam login
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}${json.redirect}`
    } 
})
</script>