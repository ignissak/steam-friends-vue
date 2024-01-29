<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useCookies } from '@vueuse/integrations/useCookies';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const useRoute = useRouter();

userStore.signOut();
useRoute.push('/');

const cookies = useCookies(['steam-session']);
cookies.remove('steam-session');
</script>
