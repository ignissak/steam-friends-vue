<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useCookies } from '@vueuse/integrations/useCookies';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const useRoute = useRouter();

const cookies = useCookies(['steam-session']);
cookies.remove('steam-session');

userStore.signOut();
useRoute.push('/');
</script>
