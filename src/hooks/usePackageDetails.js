
import { useState, useEffect, useCallback } from 'react';
import { getPackageById, createVirtualFreePackage } from '@/services/packageService';
import { FREE_PACKAGE_ID } from '@/lib/constants';
import { useLanguage } from '@/contexts/useLanguage';

const usePackageDetails = (profile) => {
  const { language } = useLanguage();
  const [currentPackageDetails, setCurrentPackageDetails] = useState(null);
  const [isLoadingPackage, setIsLoadingPackage] = useState(true);
  const [packageError, setPackageError] = useState(null);

  const fetchPackageDetails = useCallback(async () => {
    if (!profile) {
      setIsLoadingPackage(false);
      return;
    }

    setIsLoadingPackage(true);
    setPackageError(null);

    try {
      let pkgDetails;
      if (profile.subscription_package_id && profile.subscription_package_id !== FREE_PACKAGE_ID) {
        pkgDetails = await getPackageById(profile.subscription_package_id);
      } else {
        pkgDetails = createVirtualFreePackage(language);
      }
      
      if (pkgDetails) {
        setCurrentPackageDetails(pkgDetails);
      } else if (profile.subscription_package_id && profile.subscription_package_id !== FREE_PACKAGE_ID) {
        console.warn(`Package details not found for ID: ${profile.subscription_package_id}. Falling back to virtual free package.`);
        setCurrentPackageDetails(createVirtualFreePackage(language));
      } else {
         setCurrentPackageDetails(createVirtualFreePackage(language));
      }

    } catch (error) {
      console.error("Error fetching package details:", error);
      setPackageError("فشل في تحميل تفاصيل الباقة.");
      setCurrentPackageDetails(createVirtualFreePackage(language));
    } finally {
      setIsLoadingPackage(false);
    }
  }, [profile, language]);

  useEffect(() => {
    fetchPackageDetails();
  }, [fetchPackageDetails]);

  return { currentPackageDetails, isLoadingPackage, packageErrorState: packageError, refetchPackageDetails: fetchPackageDetails };
};

export default usePackageDetails;
