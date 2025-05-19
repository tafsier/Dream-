
    export const featuresData = [
      { id: 'instant', titleKey: 'home.featureInstantTitle', descriptionKey: 'home.featureInstantDesc', delay: 0.1 },
      { id: 'expert', titleKey: 'home.featureExpertTitle', descriptionKey: 'home.featureExpertDesc', delay: 0.2 },
      { id: 'secure', titleKey: 'home.featureSecureTitle', descriptionKey: 'home.featureSecureDesc', delay: 0.3 },
    ];
    
    export const howItWorksStepsData = [
      { id: 'submit', titleKey: 'home.stepSubmitTitle', descriptionKey: 'home.stepSubmitDesc', number: 1, delay: 0.1 },
      { id: 'analyze', titleKey: 'home.stepAnalyzeTitle', descriptionKey: 'home.stepAnalyzeDesc', number: 2, delay: 0.2 },
      { id: 'receive', titleKey: 'home.stepReceiveTitle', descriptionKey: 'home.stepReceiveDesc', number: 3, delay: 0.3 },
    ];
    
    export const testimonialsData = [
      {
        id: 't1',
        nameKey: 'home.testimonial1Name',
        textKey: 'home.testimonial1Text',
        roleKey: 'home.testimonial1Role',
        imageAltKey: 'home.testimonial1Alt',
        imageName: 'Pleased man reflecting on dream interpretation',
      },
      {
        id: 't2',
        nameKey: 'home.testimonial2Name',
        textKey: 'home.testimonial2Text',
        roleKey: 'home.testimonial2Role',
        imageAltKey: 'home.testimonial2Alt',
        imageName: 'Woman smiling after insightful dream analysis',
      },
      {
        id: 't3',
        quoteKey: 'home.testimonial3Quote',
        nameKey: 'home.testimonial3Author', 
        roleKey: 'home.testimonial3Role',
        imageAltKey: 'home.testimonial3Alt',
        imageName: 'Man looking satisfied with quick dream service',
      },
    ];
    
    export const propheticGuidanceData = {
      mainTitleKey: 'home.propheticGuidance.mainTitle',
      tocTitleKey: 'home.propheticGuidance.tocTitle',
      narratorLabelKey: 'home.propheticGuidance.narratorLabel',
      sourceLabelKey: 'home.propheticGuidance.sourceLabel',
      scholarLabelKey: 'home.propheticGuidance.scholarLabel',
      sections: [
        {
          id: 'section1',
          titleKey: 'home.propheticGuidance.section1.title',
          content: [
            {
              type: 'hadith',
              textKey: 'home.propheticGuidance.section1.content.0.text',
              narratorKey: 'home.propheticGuidance.section1.content.0.narrator',
              sourceKey: 'home.propheticGuidance.section1.content.0.source',
            },
          ],
        },
        {
          id: 'section2',
          titleKey: 'home.propheticGuidance.section2.title',
          content: [
            {
              type: 'quote',
              textKey: 'home.propheticGuidance.section2.content.0.text',
              authorKey: 'home.propheticGuidance.section2.content.0.author',
              authorTypeKey: 'home.propheticGuidance.section2.content.0.authorType',
            },
          ],
        },
        {
          id: 'section3',
          titleKey: 'home.propheticGuidance.section3.title',
          content: [
            {
              type: 'paragraph',
              textKey: 'home.propheticGuidance.section3.content.0.text',
            },
            {
              type: 'list',
              itemsKeys: [
                'home.propheticGuidance.section3.content.1.items.0',
                'home.propheticGuidance.section3.content.1.items.1',
                'home.propheticGuidance.section3.content.1.items.2',
                'home.propheticGuidance.section3.content.1.items.3',
              ],
            },
          ],
        },
        {
          id: 'section4',
          titleKey: 'home.propheticGuidance.section4.title',
          content: [
            {
              type: 'hadith',
              textKey: 'home.propheticGuidance.section4.content.0.text',
              narratorKey: 'home.propheticGuidance.section4.content.0.narrator',
              sourceKey: 'home.propheticGuidance.section4.content.0.source',
            },
            {
              type: 'hadith',
              textKey: 'home.propheticGuidance.section4.content.1.text',
              narratorKey: 'home.propheticGuidance.section4.content.1.narrator',
              sourceKey: 'home.propheticGuidance.section4.content.1.source',
            },
          ],
        },
        {
          id: 'section5',
          titleKey: 'home.propheticGuidance.section5.title',
          content: [
            {
              type: 'quote',
              textKey: 'home.propheticGuidance.section5.content.0.text',
              authorKey: 'home.propheticGuidance.section5.content.0.author',
              authorTypeKey: 'home.propheticGuidance.section5.content.0.authorType',
            },
          ],
        },
      ],
    };
  