import { ref } from 'vue';
import type { Forum } from '../types';
import forumInfo from '../forum-config.json';

const ENDPOINT_URL = forumInfo.dataApi;

const content = ref<Forum | null>()
const isUpdating = ref(false);

export function useForum() {
    const update = async () => {
        isUpdating.value = true;

        try {
            const result = await fetch(ENDPOINT_URL);
            if (!result.ok) {
                console.error(new Error(`Failed to fetch from ${ENDPOINT_URL}`))
            }

            content.value = await result.json();
            isUpdating.value = false;
        } catch(err) {
            console.error(err);
        }

        isUpdating.value = false;
    }

    const isAdmin = (address: string) => {
        if (!content.value) {
            console.log('no content?')
            return false;
        }

        if (content.value.admins.find(x => x == address)) {
            return true;
        }

        if (content.value.owner === address) {
            return true;
        }

        return false;
    }

    return {
        content,
        isUpdating,
        isAdmin,
        update
    }
}