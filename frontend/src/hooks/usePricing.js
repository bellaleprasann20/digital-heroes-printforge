
import { useCallback, useState } from 'react';
import api from '../services/api';

export default function usePricing() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculatePrice = useCallback(async (configuration) => {
    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      const {
        configuration: productConfiguration,
        ...productDetails
      } = configuration || {};

      const payload = {
        ...productConfiguration,
        ...productDetails,
      };

      const result = await api.post('/api/pricing/quote', payload);
      const calculatedQuote = result?.quote || result;

      if (!calculatedQuote || calculatedQuote.total == null) {
        throw new Error('The pricing service returned an invalid quote.');
      }

      setQuote(calculatedQuote);
      return calculatedQuote;
    } catch (err) {
      setError(err.message || 'Price calculation failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetQuote = useCallback(() => {
    setQuote(null);
    setError(null);
  }, []);

  return {
    quote,
    loading,
    error,
    calculatePrice,
    resetQuote,
  };
}
