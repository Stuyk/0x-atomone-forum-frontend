import { ref } from 'vue';
import type { Proposal } from '../types';
import { rest } from '../chain-config.json';

const proposals = ref<{ [id: string]: Proposal }>({});

export function useProposals() {

    async function fetchProposal(id: string) {
        if (proposals.value[id]) {
            return;
        }

        try {
            const result = await fetch(`${rest}atomone/gov/v1/proposals/${id}`);
            if (!result.ok) {
                console.error(`Failed to fetch proposal ${id}`);
                return;
            }

            proposals.value[id] = await result.json() as Proposal;
        } catch(err) {
            console.error(`Failed to fetch proposal ${id}`);
        }
    }

    return {
        fetchProposal,
        proposals
    }
}