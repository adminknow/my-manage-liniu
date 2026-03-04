import { ref, isRef, watchEffect } from 'vue';
import { HasRightes } from '@/api/index.js';

export function useRights(codes) {
  const rights = ref({});
  const loading = ref(false);

  const getCodesArray = () => (isRef(codes) ? codes.value : codes);

  const fetch = async () => {
    const arr = getCodesArray();
    if (!Array.isArray(arr) || arr.length === 0) return;
    loading.value = true;
    try {
      const res = await HasRightes({ RightCodes: arr });
      if (res.Code === 200) rights.value = res.DataMap || {};
    } finally {
      loading.value = false;
    }
  };

  watchEffect(fetch);

  const hasRight = (code) => !!rights.value[code];
  const hasAllRights = (arr) => arr.every(c => hasRight(c));
  const hasAnyRights = (arr) => arr.some(c => hasRight(c));

  return { rights, hasRight, hasAllRights, hasAnyRights, loading, refresh: fetch };
}