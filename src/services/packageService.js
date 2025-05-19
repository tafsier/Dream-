
    import { supabase } from '@/lib/supabaseClient';
    import { FREE_PACKAGE_ID, DEFAULT_FREE_CHAR_LIMIT, DEFAULT_FREE_INTERPRETATIONS, PACKAGE_NAMES_AR, PACKAGE_NAMES_EN } from '@/lib/constants';
    
    export async function getRawPackages() {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });
    
      if (error) {
        console.error('[PackageService] Error fetching raw packages:', error);
        throw error;
      }
      return data;
    }
    
    export async function getAllPackagesForDisplay(language = 'ar') {
      console.log(`[PackageService] Fetching all packages for display in ${language}...`);
      try {
        const rawPackages = await getRawPackages();
        const processedPackages = rawPackages.map(pkg => ({
          ...pkg,
          name: language === 'ar' ? pkg.name_ar : pkg.name_en,
          features: language === 'ar' ? pkg.features_ar : pkg.features_en,
        }));
    
        const freePackageExists = processedPackages.some(pkg => pkg.id === FREE_PACKAGE_ID);
        if (!freePackageExists) {
          processedPackages.unshift(createVirtualFreePackage(language));
        }
        
        console.log('[PackageService] All packages for display fetched and processed:', processedPackages);
        return processedPackages;
      } catch (error) {
        console.error('[PackageService] Error in getAllPackagesForDisplay:', error);
        throw error;
      }
    }
    
    export async function getFeaturedPackages(language = 'ar', maxPlans = 3) {
      console.log(`[PackageService] Fetching featured packages (max ${maxPlans}) in ${language}...`);
      try {
        const allDisplayPackages = await getAllPackagesForDisplay(language);
        
        const nonFreePackages = allDisplayPackages.filter(pkg => pkg.id !== FREE_PACKAGE_ID);
        
        let featured = [];
        if (nonFreePackages.length > 0) {
            featured = nonFreePackages.slice(0, maxPlans);
        } else {
            const freePackage = allDisplayPackages.find(pkg => pkg.id === FREE_PACKAGE_ID);
            if (freePackage) {
                featured = [freePackage];
            }
        }
        console.log('[PackageService] Featured packages fetched:', featured);
        return featured;
    
      } catch (error) {
        console.error('[PackageService] Error in getFeaturedPackages:', error);
        throw error; 
      }
    }
    
    
    export async function getPackageById(packageId, language = 'ar') {
      if (!packageId) {
        console.warn('[PackageService] getPackageById called with no packageId. Returning null.');
        return null;
      }
      if (packageId === FREE_PACKAGE_ID) {
        console.log('[PackageService] Requested free package. Returning virtual free package.');
        return createVirtualFreePackage(language);
      }
    
      console.log(`[PackageService] Fetching package by ID: ${packageId} in ${language}`);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', packageId)
        .single();
    
      if (error) {
        if (error.code === 'PGRST116') { 
          console.warn(`[PackageService] Package with ID ${packageId} not found.`);
          return null;
        }
        console.error(`[PackageService] Error fetching package ${packageId}:`, error);
        throw error;
      }
      
      const processedData = {
        ...data,
        name: language === 'ar' ? data.name_ar : data.name_en,
        features: language === 'ar' ? data.features_ar : data.features_en,
      };
      console.log(`[PackageService] Package ${packageId} fetched and processed successfully:`, processedData);
      return processedData;
    }
    
    export function createVirtualFreePackage(language = 'ar') {
      const names = language === 'ar' ? PACKAGE_NAMES_AR : PACKAGE_NAMES_EN;
      const defaultFeaturesAr = [`${DEFAULT_FREE_INTERPRETATIONS} تفسير مجاني`, `حد ${DEFAULT_FREE_CHAR_LIMIT} حرف لكل رؤيا`];
      const defaultFeaturesEn = [`${DEFAULT_FREE_INTERPRETATIONS} free interpretation(s)`, `${DEFAULT_FREE_CHAR_LIMIT} character limit per dream`];
    
      return {
        id: FREE_PACKAGE_ID,
        name_ar: names[FREE_PACKAGE_ID] || "الباقة المجانية",
        name_en: names[FREE_PACKAGE_ID] || "Free Plan",
        name: language === 'ar' ? (names[FREE_PACKAGE_ID] || "الباقة المجانية") : (names[FREE_PACKAGE_ID] || "Free Plan"),
        price_monthly: 0,
        character_limit: DEFAULT_FREE_CHAR_LIMIT,
        interpretations_limit: DEFAULT_FREE_INTERPRETATIONS,
        features_ar: defaultFeaturesAr,
        features_en: defaultFeaturesEn,
        features: language === 'ar' ? defaultFeaturesAr : defaultFeaturesEn,
        stripe_price_id: null,
        is_active: true,
        duration_days: null, 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  