/* =========================================================
   GROUP CAM — i18n.js
   Site bilingue Français (par défaut) / Arabe.

   Fonctionnement :
   - Le français reste écrit directement dans le HTML (source de vérité).
   - Les éléments traduisibles portent un attribut :
       data-i18n="clé"            → remplace le texte de l'élément
       data-i18n-html="clé"       → remplace le contenu HTML (paragraphes avec liens)
       data-i18n-attr="attr:clé"  → traduit un attribut (placeholder, aria-label, alt, title, content)
   - Les traductions arabes sont dans le dictionnaire AR ci-dessous.
   - Les messages utilisés par le JavaScript (erreurs, boutons, WhatsApp) sont dans UI.
   - Le choix de langue est mémorisé dans le localStorage.
   Pour ajouter une langue : ajouter un dictionnaire, l'ajouter à SUPPORTED et à DICTIONARIES.
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'groupcam_lang';
  var DEFAULT_LANG = 'fr';
  var SUPPORTED = ['fr', 'ar'];
  var RTL_LANGS = ['ar'];
  var ARABIC_FONT_URL = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap';

  /* ---------- Dictionnaire arabe (clé → texte) ---------- */
  var AR = {
    'meta.title': 'كاميرات مراقبة | تركيب كاميرات CCTV Dahua — GROUP CAM', // Caméra de surveillance | Installation CCTV Dahua — GROUP CAM
    'meta.desc': 'GROUP CAM: كاميرات مراقبة، تركيب أنظمة CCTV، أنظمة إنذار، تحكم في الدخول ومنزل ذكي. معدات Dahua، عرض سعر مجاني.', // GROUP CAM : caméra de surveillance, installation CCTV, système d'alarm
    'meta.title_why': 'لماذا تختار GROUP CAM؟ — GROUP CAM', // Pourquoi choisir GROUP CAM ? — GROUP CAM
    'meta.desc_why': 'لماذا تختار GROUP CAM: متخصص في Dahua، تركيب متكامل، أسعار تنافسية، سرعة في التدخل ومرافقة من الألف إلى الياء.', // Pourquoi choisir GROUP CAM : spécialiste Dahua, installation clé en main, prix compétitifs, réactivité et accompagnement de A à Z.
    'attr.logo_link': 'GROUP CAM - الرئيسية', // GROUP CAM - Accueil
    'attr.logo_alt': 'GROUP CAM - كاميرات مراقبة Dahua', // GROUP CAM - Caméras de surveillance Dahua
    'attr.menu_open': 'فتح القائمة', // Ouvrir le menu
    'attr.cert_zoom': 'عرض شهادة Cambridge Academy بحجم أكبر (تفتح في علامة تبويب جديدة)', // Voir le certificat Cambridge Academy en grand (s'ouvre dans un nouvel 
    'attr.cert_alt': 'شهادة Cambridge Academy رقم 003768: تركيب وبرمجة أنظمة المراقبة، صادرة بتاريخ 8 أبريل 2018', // Certificat Cambridge Academy n° 003768 : installation et programmation
    'attr.cert_zoom_dahua': 'عرض شهادة Dahua بحجم أكبر (تفتح في علامة تبويب جديدة)', // Voir le certificat Dahua en grand (s'ouvre dans un nouvel onglet)
    'attr.cert_alt_dahua': 'شهادة Dahua ⁦DHSA - VMS⁩ (Video Management System Certified Associate) صادرة لفائدة GROUP CAM، صالحة حتى 4 فبراير 2028', // Certificat Dahua DHSA - VMS (Video Management System Certified Associate) délivré à GROUP CAM, valable jusqu'au 4 février 2028
    'attr.photo_caption': 'تعليق الصورة', // Légende de la photo
    'attr.reviews_all': 'عرض جميع تقييمات GROUP CAM على Google', // Voir tous les avis Google de GROUP CAM
    'attr.reviews_region': 'آراء العملاء، مرّر أفقيًا للتصفح', // Avis clients, faites défiler horizontalement
    'attr.review_prev': 'التقييم السابق', // Avis précédent
    'attr.review_next': 'التقييم التالي', // Avis suivant
    'attr.ph_name': 'اسمك', // Votre nom
    'attr.ph_message': 'صِف مشروعك (عدد الغرف، المساحة، احتياجات خاصة...)', // Décrivez votre projet (nombre de pièces, surface, besoins spécifiques.
    'attr.map_title': 'موقع GROUP CAM على خرائط Google', // Localisation de GROUP CAM sur Google Maps
    'attr.legal_nav': 'معلومات قانونية', // Informations légales
    'attr.wa_float': 'تحدث مع GROUP CAM عبر واتساب', // Discuter avec GROUP CAM sur WhatsApp
    'attr.cookie_region': 'الموافقة على ملفات الكوكيز', // Consentement aux cookies
    'nav.1': 'الرئيسية', // Accueil
    'nav.2': 'الخدمات', // Services
    'nav.3': 'العروض والتخفيضات', // Offres & Promos
    'nav.4': 'لماذا نحن', // Pourquoi Nous
    'nav.5': 'آراء العملاء', // Avis Clients
    'nav.6': 'اتصل بنا', // Contact
    'nav.7': 'عرض سعر مجاني', // Devis Gratuit
    'nav.8': 'اتصل بنا : ⁦+213 559 211 315⁩', // Appeler : +213 559 211 315
    'hero.1': 'رقم 1 في مجال الأمن — ⁦5.0/5⁩ على Google (⁦+106⁩ تقييم)', // N°1 de la sécurité — 5.0/5 sur Google (106+ avis)
    'hero.2': 'احمِ ما يهمّك أكثر مع GROUP CAM', // Protégez ce qui compte le plus avec GROUP CAM
    'hero.3': 'بيع وتركيب احترافي ومشاهدة عن بُعد عبر الهاتف الذكي للمنازل والمحلات التجارية والمؤسسات.', // Vente, installation professionnelle et visionnage à distance sur smart
    'hero.4': 'اطلب عرض سعر مجاني', // Demander un Devis Gratuit
    'hero.5': 'تواصل عبر واتساب', // Contact WhatsApp
    'hero.6': 'معدات Dahua أصلية ⁦100%⁩', // Matériel Dahua 100% Original
    'hero.7': 'تركيب احترافي وسريع', // Installation Pro & Rapide
    'hero.8': 'خدمة ما بعد البيع ودعم مخصص', // SAV & Support Dédié
    'hero.9': 'REC — مركز المراقبة GROUP CAM', // REC — POSTE DE CONTRÔLE GROUP CAM
    'hero.10': 'كاميرا 01 — غرفة التحكم', // CAM 01 — SALLE DE CONTRÔLE
    'hero.11': 'كاميرا 02 — الساحة (رؤية ليلية)', // CAM 02 — COUR (VISION NOCTURNE)
    'hero.12': 'كاميرا 03 — فضاء المحل / الواجهة', // CAM 03 — ESPACE MAGASIN / VITRINE
    'hero.13': 'كاميرا 04 — مدخل مؤمَّن', // CAM 04 — ACCÈS SÉCURISÉ
    'hero.14': 'مشاهدة مباشرة من هاتفك الذكي، أينما كنت.', // Accès en direct depuis votre smartphone, où que vous soyez.
    'brands.1': 'شركاؤنا وعلاماتنا', // Nos partenaires & marques
    'brands.2': 'علاماتنا التجارية والمصنّعون', // Nos Marques & Fabricants
    'brands.3': 'مصنّعون رائدون في المراقبة بالكاميرات وأنظمة الإنذار والتحكم في الدخول، لمعدات موثوقة وأصلية.', // Des fabricants de référence en vidéosurveillance, alarme et contrôle d
    'why.1': 'لماذا تختار GROUP CAM؟', // Pourquoi choisir GROUP CAM ?
    'why.2': 'انطلاقًا من محلنا بشارع العقيد عميروش، نجهّز الأفراد والمؤسسات بخبرة تقنية معترف بها.', // Depuis notre boutique du Boulevard Colonel Amirouche, nous équipons pa
    'why.3': 'متخصصون في Dahua', // Spécialiste Dahua
    'why.4': 'معدات رسمية، وجودة صورة HD/4K، ورؤية ليلية متطورة لمراقبة موثوقة ليلًا ونهارًا.', // Matériel officiel, qualité d'image HD/4K et vision nocturne avancée po
    'why.5': 'تركيب جاهز للاستخدام', // Installation Clé en Main
    'why.6': 'تمديد كابلات منظّم، وضبط دقيق لزوايا الرؤية، وإعداد التطبيق على الهاتف مجانًا مع كل تركيب.', // Câblage propre, réglage précis des angles de vue et configuration mobi
    'why.7': 'أسعار تنافسية', // Prix Compétitifs
    'why.8': 'أفضل الأسعار، مع ضمان المصنّع على جميع المعدات المباعة.', // Les meilleurs tarifs, avec garantie constructeur sur tout le matériel 
    'why.9': 'تدخّل سريع وتجاوب', // Intervention & Réactivité
    'why.10': 'فريق سريع الاستجابة، وخدمة ما بعد البيع سريعة، ومتابعة مضمونة للعميل بعد كل تركيب.', // Une équipe réactive, un service après-vente rapide et un suivi client 
    'certs.1': 'خبرة معتمدة', // Expertise reconnue
    'certs.2': 'شهاداتنا ومؤهلاتنا', // Nos Certifications & Qualifications
    'certs.3': 'كفاءات معتمدة من هيئات ومصنّعين مرجعيين، لتركيب موثوق ومطابق لأصول المهنة.', // Des compétences validées par des organismes et des constructeurs de ré
    'certs.4': 'تكبير', // Agrandir
    'certs.5': 'شهادة في تركيب وبرمجة أنظمة المراقبة، صادرة عن Cambridge Academy (المملكة المتحدة) بتاريخ 8 أبريل 2018.', // Certificat en installation et programmation de systèmes de surveillanc
    'certs.6': 'شهادة رسمية ⁦DHSA - VMS⁩ (⁦Video Management System Certified Associate⁩ — برنامج شهادات الخدمة التقنية من Dahua)، صادرة لفائدة GROUP CAM وصالحة حتى 4 فبراير 2028 (رقم ⁦DHSA-VMSEN202602049965⁩).', // Certification officielle DHSA - VMS (Video Management System Certified Associate — Dahua Technical Service Certification Program), délivrée à GROUP CAM, valable jusqu'au 4 février 2028 (N° DHSA-VMSEN202602049965).
    'certs.7': 'اعتماد رسمي', // Agrément officiel
    'certs.8': 'اعتماد وزارة الداخلية', // Agrément du Ministère de l'Intérieur
    'certs.9': 'تحوز GROUP CAM على اعتماد رسمي صادر عن وزارة الداخلية الجزائرية، يخوّل لها ممارسة الأنشطة المعنية في مجال الأمن الإلكتروني، وفقًا للتنظيم الساري المفعول.', // GROUP CAM est titulaire d'un agrément officiel délivré par le Ministère de l'Intérieur algérien...
    'certs.10': 'وزارة الداخلية', // MINISTÈRE DE L'INTÉRIEUR
    'services.1': 'خدماتنا', // Nos services
    'services.2': 'كاميرات ذكية، وأنظمة إنذار، وسلامة من الحريق، وشبكات، وتحكم في الدخول، وأنظمة آلية، ومنزل ذكي: عرض متكامل للأمن، يُباع ويُركَّب على أيدي محترفين.', // Caméras intelligentes, alarmes, sécurité incendie, réseaux, contrôle d
    'svct.0': 'اختر خدمة', // Choisir un service
    'svct.1': 'كاميرات', // Caméras
    'svct.2': 'إنذار', // Alarmes
    'svct.3': 'حريق', // Incendie
    'svct.4': 'شبكات وألياف', // Réseaux & Fibre
    'svct.5': 'التحكم في الدخول', // Contrôle d'accès
    'svct.6': 'بوابات وحواجز', // Portails & Barrières
    'svct.7': 'منزل ذكي', // Smart Home
    'services.3': 'كاميرات مراقبة ذكية (الذكاء الاصطناعي)', // Caméras de surveillance intelligentes (IA)
    'services.4': 'كاميرات Dahua تفهم ما تراه، لمراقبة دقيقة ليلًا ونهارًا.', // Des caméras Dahua qui comprennent ce qu'elles voient, pour une surveil
    'services.5': 'تمييز تلقائي بين الأشخاص والغرباء والمركبات', // Distinction automatique entre personnes, étrangers et véhicules
    'services.6': 'تنبيهات فورية على الهاتف عند رصد حركة مشبوهة', // Alertes instantanées sur smartphone en cas de mouvement suspect
    'services.7': 'مشاهدة عن بُعد وتركيب احترافي مُحسَّن', // Visionnage à distance et installation professionnelle optimisée
    'services.8': 'أنظمة إنذار ضد السرقة', // Systèmes d'alarme anti-vol
    'services.9': 'تحرّك قبل فوات الأوان: يتم رصد التسلل قبل حدوث الاقتحام نفسه.', // Intervenez avant qu'il ne soit trop tard : l'intrusion est détectée av
    'services.10': 'رصد المتسللين قبل الاقتحام', // Détection des intrus avant l'effraction
    'services.11': 'تنبيهات فورية على هاتفك', // Alertes instantanées sur votre téléphone
    'services.12': 'ردع مباشر: إنذار صوتي وإضاءة', // Dissuasion directe : alarme sonore et éclairage
    'services.13': 'كاشفات الحريق', // Détecteurs d'incendie
    'services.14': 'سلامة من الحريق تحمي ممتلكاتك والأرواح قبل أن تنتشر النيران.', // Une sécurité incendie qui protège vos biens et surtout les vies, avant
    'services.15': 'كشف مبكر للدخان والحرارة', // Détection précoce des fumées et de la chaleur
    'services.16': 'ربط بالنظام الذكي وبهاتفك', // Liaison avec le système intelligent et votre téléphone
    'services.17': 'حماية الممتلكات والأرواح', // Protection des biens et des vies
    'services.18': 'الشبكات المعلوماتية والألياف الضوئية', // Réseaux informatiques & Fibre optique
    'services.19': 'بنية شبكية موثوقة لمكاتبك ومؤسستك.', // Une infrastructure réseau fiable pour vos bureaux et votre entreprise.
    'services.20': 'تصميم الشبكات المحلية السلكية واللاسلكية (Wi-Fi)', // Conception de réseaux locaux filaires et Wi-Fi
    'services.21': 'تركيب خزائن التوصيل (Racks) والخوادم', // Installation de baies de brassage et de serveurs
    'services.22': 'مدّ وتوسيع كابلات الألياف الضوئية', // Tirage et extension de câbles à fibre optique
    'services.23': 'دعم تقني واستقرار مضمون', // Support technique et stabilité garantie
    'services.24': 'التحكم في الدخول، تسجيل الحضور، الإنترفون والفيديو إنترفون', // Contrôle d'accès, Pointage, Interphonie & Visiophonie
    'services.25': 'تحكّم فيمن يدخل ومن يخرج، من العمارة إلى المؤسسة.', // Maîtrisez qui entre et qui sort, de l'immeuble à l'entreprise.
    'services.26': 'إدارة الدخول والخروج ببطاقة تعريف أو ببصمة إصبع ذكية', // Gestion des entrées/sorties par badge ou empreinte digitale intelligen
    'services.27': 'أجهزة إنترفون وفيديو إنترفون لتأمين مداخل العمارات والمؤسسات والإقامات', // Interphones et visiophones pour sécuriser les accès aux immeubles, ent
    'services.28': 'حواجز آلية وبوابات وأبواب مرائب كهربائية', // Barrières automatiques, Portails & Garages électriques
    'services.29': 'مزيد من الراحة والأمان عند كل دخول وخروج للمركبات.', // Plus de confort et de sécurité à chaque entrée et sortie de véhicule.
    'services.30': 'أتمتة البوابات وأبواب المرائب', // Automatisation de portails et de portes de garage
    'services.31': 'تحكم عن بُعد عبر الهاتف الذكي أو جهاز تحكم لاسلكي', // Commande à distance via smartphone ou télécommande sans fil
    'services.32': 'المنزل الذكي (Smart Home)', // Maison intelligente (Smart Home)
    'services.33': 'منزلك كله في جيبك: نقطة تحكم واحدة من هاتفك.', // Toute votre maison dans votre poche : un seul point de contrôle, depui
    'services.34': 'مركزة وتحكم كامل في المنزل من الهاتف', // Centralisation et contrôle total de la maison depuis le téléphone
    'services.35': 'الإضاءة والدخول والكاميرات والأمن مجتمعة في مكان واحد', // Éclairages, accès, caméras et sécurité réunis au même endroit
    'services.36': 'مرافقة من الألف إلى الياء', // Un accompagnement de A à Z
    'services.37': 'بيع معدات Dahua', // Vente de matériel Dahua
    'services.38': 'كاميرات IP/HD وأجهزة تسجيل DVR/NVR وحزم كاملة، تُختار وفق احتياجاتك الفعلية.', // Caméras IP/HD, enregistreurs DVR/NVR et kits complets, sélectionnés se
    'services.39': 'التوصيل والاستلام', // Livraison & Retrait
    'services.40': 'الاستلام من المحل أو التوصيل السريع، حسب رغبتك.', // Retrait en magasin ou livraison rapide, selon votre préférence.
    'services.41': 'الصيانة وخدمة ما بعد البيع', // Maintenance & SAV
    'services.42': 'خدمة ما بعد البيع متاحة لأي ضبط أو إصلاح أو توسيع لنظامك.', // Un service après-vente disponible pour tout réglage, dépannage ou exte
    'offers.1': 'العروض والتخفيضات', // Offres & Promotions
    'offers.2': 'اكتشف عروضنا الحالية على معدات الأمان Dahua وخدمات التركيب.', // Découvrez nos offres du moment sur le matériel de sécurité Dahua et les installations.
    'work.1': 'تدخلاتنا الميدانية', // Nos interventions sur le terrain
    'work.2': 'من الدراسة على المخططات إلى التركيب الكامل: اكتشف فريقنا أثناء العمل في مختلف المواقع.', // De l'étude sur plans à l'installation complète : découvrez notre équipe en action sur différents sites.
    'work.3': 'محل', // Magasin
    'work.4': 'تركيب كاميرا HD - محل', // Installation Caméra HD - Magasin
    'work.5': 'فيلا', // Villa
    'work.6': 'تمديد كابلات منظم وآمن - فيلا', // Câblage propre et sécurisé - Villa
    'work.7': 'مؤسسة', // Entreprise
    'work.8': 'إعداد جهاز NVR - مؤسسة', // Configuration NVR - Entreprise
    'work.9': 'مستودع', // Entrepôt
    'work.10': 'تغطية كاملة - مستودع', // Couverture complète - Entrepôt
    'work.11': 'خارجي', // Extérieur
    'work.12': 'رؤية ليلية - موقف سيارات', // Vision nocturne - Parking
    'work.13': 'وصول عن بُعد', // Accès à distance
    'work.14': 'المشاهدة على الهاتف الذكي - عميل', // Visionnage sur smartphone - Client
    'work.15': 'تركيب كاميرا خارجية HD', // Installation de caméra extérieure HD
    'work.16': 'تركيب وتجهيز في موقع صناعي / مستودع', // Installation et pose sur site industriel / entrepôt
    'work.17': 'قريبًا', // Bientôt disponible
    'work.18': 'الإنجاز القادم', // Prochaine réalisation
    'work.19': 'الصور متوفرة قريبًا', // Photos bientôt disponibles
    'attr.work_alt_1': 'فني من GROUP CAM يركّب كاميرا مراقبة على الواجهة الخارجية لمسكن وهو واقف على سلّم من الألمنيوم', // alt photo 1
    'attr.work_alt_2': 'فني من GROUP CAM يقطع قطعة معدنية بالمِجرَشة داخل مستودع صناعي كبير', // alt photo 2
    'work.20': 'صندوق الشبكة والكاميرا', // Coffret & Caméra
    'work.21': 'دراسة ومخططات', // Étude & Plans
    'work.22': 'هندسة', // Ingénierie
    'work.23': 'تركيب كاميرا قبّة وصندوق الشبكة', // Installation de caméra dôme et coffret réseau
    'work.24': 'دراسة تقنية وتحديد مواقع التركيب على المخططات', // Étude technique et implantation sur plans
    'work.25': 'تصميم النظام وتخطيطه في الموقع', // Conception et planification du système sur site
    'attr.work_alt_3': 'فني من GROUP CAM أمام صندوق الشبكة وكاميرا مراقبة على شكل قبّة مثبّتة في السقف', // alt photo 3
    'attr.work_alt_4': 'يد تشير إلى المخططات المعمارية المفرودة على الطاولة بجانب حاسوب محمول', // alt photo 4
    'attr.work_alt_5': 'فريق GROUP CAM يدرس المخططات على حاسوب محمول داخل الموقع', // alt photo 5
    'attr.social_fb': 'GROUP CAM على فيسبوك', // GROUP CAM sur Facebook
    'attr.social_ig': 'GROUP CAM على إنستغرام', // GROUP CAM sur Instagram
    'reviews.1': 'ماذا يقول عملاؤنا', // Ce que disent nos clients
    'reviews.2': 'ثقة عملائنا، تقييمًا بعد تقييم.', // La confiance de nos clients, avis après avis.
    'reviews.3': '⁦+106⁩ تقييم على Google', // 106+ avis Google
    'reviews.4': 'عرض جميع تقييماتنا على Google (⁦5.0/5⁩)', // Voir tous nos avis Google (5.0/5)
    'refs.1': 'مراجعنا من العملاء', // Nos références clients
    'refs.2': 'يثقون بنا', // Ils nous font confiance
    'refs.3': 'مؤسسات وهيئات مهنية تعهد إلينا بأمن مواقعها.', // Des entreprises et des établissements professionnels nous confient la 
    'contact.1': 'اطلب عرض سعرك المجاني', // Demandez votre devis gratuit
    'contact.2': 'صِف لنا مشروعك، وسيتواصل معك فريقنا بسرعة بعرض مناسب.', // Décrivez votre projet, notre équipe vous recontacte rapidement avec un
    'contact.3': 'الاسم الكامل', // Nom complet
    'contact.4': 'الهاتف', // Téléphone
    'contact.5': 'البريد الإلكتروني', // Adresse e-mail
    'contact.6': '(اختياري)', // (facultatif)
    'contact.7': 'نوع المشروع / الموقع', // Type de projet / lieu
    'contact.8': 'اختر خيارًا', // Sélectionnez une option
    'contact.9': 'منزل / فيلا', // Maison / Villa
    'contact.10': 'محل / تجارة', // Magasin / Commerce
    'contact.11': 'مؤسسة / مستودع', // Entreprise / Dépôt
    'contact.12': 'التحكم في الدخول والإنترفون والفيديو إنترفون', // Contrôle d'accès, Interphonie & Visiophonie
    'contact.13': 'حواجز آلية وبوابات ومرائب', // Barrières automatiques, Portails & Garages
    'contact.14': 'أخرى', // Autre
    'loc.1': 'مصنع / مؤسسة', // Usine / Entreprise
    'loc.2': 'المؤسسات العمومية والتعليمية', // Établissements publics & Éducatifs
    'loc.3': 'مركز تجاري', // Centre commercial
    'loc.4': 'فندق', // Hôtel
    'loc.5': 'مستشفى / عيادة', // Hôpital / Clinique
    'loc.6': 'مستودع / مخزن', // Entrepôt / Dépôt
    'loc.7': 'محل / تجارة', // Magasin / Commerce
    'loc.8': 'موقف سيارات', // Parking
    'loc.9': 'ورشة / موقع بناء', // Chantier
    'loc.10': 'منزل / فيلا', // Maison / Villa
    'loc.11': 'أخرى', // Autre
    'svc.1': 'كاميرات المراقبة', // Caméras de surveillance
    'svc.2': 'أنظمة إنذار ضد التسلل', // Systèmes d'alarme anti-intrusion
    'svc.3': 'كشف الحريق', // Détection incendie
    'svc.4': 'التحكم في الدخول وتسجيل الحضور البيومتري', // Contrôle d'accès & Pointage biométrique
    'svc.5': 'الشبكات المعلوماتية والألياف الضوئية', // Réseaux informatiques & Fibre optique
    'svc.6': 'الإنترفون والفيديو إنترفون', // Interphonie & Visiophonie
    'svc.7': 'الأتمتة المنزلية / المنزل الذكي (Smart Home)', // Domotique / Smart Home
    'svc.8': 'البوابات والأبواب الآلية', // Portails & Portes automatiques
    'svc.9': 'حواجز مواقف السيارات', // Barrières de parking
    'svc.10': 'الصيانة والتصليح', // Maintenance & Dépannage
    'svc.11': 'أخرى', // Autre
    'contact.33': 'الخدمات المطلوبة', // Services souhaités
    'contact.34': '(يمكن اختيار أكثر من خدمة)', // (plusieurs choix possibles)
    'contact.15': 'الرسالة', // Message
    'contact.16': 'كيف تفضّل إرسال طلبك إلينا؟', // Comment souhaitez-vous nous envoyer votre demande ?
    'contact.17': 'عبر البريد الإلكتروني', // Par e-mail
    'contact.18': 'رد خلال 24 ساعة', // Réponse sous 24 h
    'contact.19': 'عبر واتساب', // Par WhatsApp
    'contact.20': 'تواصل مباشر', // Échange direct
    'contact.21': 'فشل الإرسال. تحقق من اتصالك بالإنترنت وأعد المحاولة، أو اتصل بنا على ⁦+213 559 211 315⁩.', // L'envoi a échoué. Vérifiez votre connexion, réessayez ou appelez-nous 
    'contact.22': 'بياناتنا', // Nos coordonnées
    'contact.23': '50 شارع العقيد عميروش، عنابة 23000', // 50 Boulevard Colonel Amirouche, Annaba 23000
    'contact.24': 'المصلحة التجارية', // Service commercial
    'contact.25': 'المصلحة التقنية', // Service technique
    'contact.26': 'الهاتف الثابت', // Téléphone fixe
    'contact.27': 'مفتوح 7 أيام في الأسبوع، حتى الساعة ⁦23:30⁩', // Ouvert 7j/7, jusqu'à 23h30
    'contact.28': 'اتصال', // Appeler
    'contact.29': 'واتساب', // WhatsApp
    'contact.30': 'الاتجاهات', // Itinéraire
    'contact.31': 'تقييمات Google (⁦5.0/5⁩)', // Avis Google (5.0/5)
    'contact.32': 'تابعنا على مواقع التواصل', // Suivez-nous sur les réseaux
    'footer.1': 'بيع وتركيب أنظمة الأمن Dahua. متخصص معتمد، ⁦5.0/5⁩ على Google.', // Vente & installation de systèmes de sécurité Dahua. Spécialiste certif
    'footer.2': 'روابط سريعة', // Liens rapides
    'footer.3': 'العروض والتخفيضات', // Offres & promos
    'footer.4': 'آراء العملاء', // Avis clients
    'footer.5': 'عرض سعر مجاني', // Devis gratuit
    'footer.6': 'تجاري :', // Commercial :
    'footer.7': 'تقني :', // Technique :
    'footer.8': 'ثابت :', // Fixe :
    'footer.9': 'تقييمات Google', // Avis Google
    'footer.10': 'أوقات العمل', // Horaires
    'footer.11': 'مفتوح 7 أيام في الأسبوع', // Ouvert 7j/7
    'footer.12': 'حتى الساعة ⁦23:30⁩', // Jusqu'à 23h30
    'footer.13': 'GROUP CAM — بيع وتركيب أنظمة الأمن Dahua. جميع الحقوق محفوظة.', // GROUP CAM — Vente & Installation de systèmes de sécurité Dahua. Tous d
    'footer.14': 'الإشعارات القانونية', // Mentions légales
    'footer.15': 'سياسة الخصوصية', // Politique de confidentialité
    'footer.16': 'تحدث معنا عبر واتساب', // Discuter sur WhatsApp
    'footer.17': 'نستخدم ملفات تعريف الارتباط (الكوكيز) لتحسين تجربتك على موقعنا. بمواصلة التصفح، فإنك توافق على استخدامنا لها.', // Nous utilisons des cookies pour optimiser votre expérience sur notre s
    'footer.18': 'اعرف المزيد', // En savoir plus
    'footer.19': 'موافق', // Accepter
    'footer.20': 'تابعنا', // Suivez-nous
    'meta.title_legal': 'الإشعارات القانونية — GROUP CAM', // Mentions légales — GROUP CAM
    'meta.desc_legal': 'الإشعارات القانونية لموقع GROUP CAM: الناشر والاستضافة والملكية الفكرية والمسؤولية.', // Mentions légales du site GROUP CAM : éditeur, hébergement, propriété i
    'legal.1': 'العودة إلى الموقع', // Retour au site
    'legal.2': 'آخر تحديث : ⁦8⁩ نوفمبر ⁦2026⁩', // Dernière mise à jour : 8 novembre 2026
    'legal.3': 'ناشر الموقع', // Éditeur du site
    'legal.4': 'الاسم التجاري :', // Nom commercial :
    'legal.5': 'التسمية الاجتماعية / الشكل القانوني :', // Raison sociale / forme juridique :
    'legal.6': '50 شارع العقيد عميروش، عنابة 23000، الجزائر', // 50 Boulevard Colonel Amirouche, Annaba 23000, Algérie
    'legal.7': 'العنوان :', // Adresse :
    'legal.8': 'المصلحة التجارية :', // Service commercial :
    'legal.9': 'المصلحة التقنية :', // Service technique :
    'legal.10': 'الهاتف الثابت :', // Téléphone fixe :
    'legal.11': 'السجل التجاري (RC) :', // Registre du commerce (RC) :
    'legal.12': 'رقم التعريف الجبائي (NIF) :', // Numéro d'identification fiscale (NIF) :
    'legal.13': 'مدير النشر :', // Directeur de la publication :
    'legal.14': 'الاستضافة', // Hébergement
    'legal.host': 'يتم استضافة الموقع لدى <mark class="bg-yellow-200 text-navy-900 px-1 rounded">[À compléter : nom et adresse de l\'hébergeur, par exemple GitHub Pages]</mark>.', // HTML
    'legal.15': 'النشاط', // Activité
    'legal.16': 'تقدّم GROUP CAM بيع وتركيب أنظمة الأمن: كاميرات المراقبة، وأنظمة الإنذار، وكاشفات الحريق، والشبكات المعلوماتية والألياف الضوئية، والتحكم في الدخول، وأتمتة البوابات، وحلول المنزل الذكي.', // GROUP CAM propose la vente et l'installation de systèmes de sécurité :
    'legal.17': 'الملكية الفكرية', // Propriété intellectuelle
    'legal.18': 'النصوص والصور ومقاطع الفيديو والعناصر الرسومية في هذا الموقع، وكذلك شعار GROUP CAM، هي ملك لـ GROUP CAM. يُمنع أي نسخ دون إذن كتابي. العلامات والشعارات المذكورة (Dahua Technology وHikvision وZKTeco وAJAX، إضافة إلى شعارات مراجعنا من العملاء) تعود ملكيتها لأصحابها، وهي معروضة على سبيل الإعلام.', // Les textes, images, vidéos et éléments graphiques de ce site, ainsi qu
    'legal.19': 'المسؤولية', // Responsabilité
    'legal.20': 'المعلومات المعروضة في هذا الموقع مقدَّمة على سبيل الاسترشاد وقابلة للتغيير. العروض والباقات والأسعار تُؤكَّد بموجب عرض سعر. تسعى GROUP CAM إلى إبقاء الموقع متاحًا ومحدَّثًا، لكنها لا تضمن خلوّه من الأخطاء أو الانقطاعات.', // Les informations présentées sur ce site sont données à titre indicatif
    'legal.21': 'الروابط والخدمات الخارجية', // Liens et services externes
    'legal.22': 'قد يحتوي هذا الموقع على روابط أو تكاملات مع خدمات طرف ثالث (خرائط Google، تقييمات Google، واتساب). GROUP CAM غير مسؤولة عن محتوى هذه الخدمات أو ممارساتها، إذ تخضع لشروط استخدامها الخاصة.', // Ce site peut contenir des liens ou intégrations vers des services tier
    'legal.23': 'القانون المطبّق', // Droit applicable
    'legal.24': 'يخضع هذا الموقع وإشعاراته القانونية للقانون الجزائري.', // Le présent site et ses mentions légales sont soumis au droit algérien.
    'legal.25': '© GROUP CAM. جميع الحقوق محفوظة.', // © GROUP CAM. Tous droits réservés.
    'meta.title_privacy': 'سياسة الخصوصية — GROUP CAM', // Politique de confidentialité — GROUP CAM
    'meta.desc_privacy': 'سياسة الخصوصية لـ GROUP CAM: البيانات المجمَّعة عبر نموذج عرض السعر، والغايات، والحقوق، وخدمات الأطراف الثالثة.', // Politique de confidentialité de GROUP CAM : données collectées via le 
    'privacy.1': 'المسؤول عن المعالجة', // Responsable du traitement
    'privacy.controller': 'المسؤول عن معالجة البيانات هو GROUP CAM، 50 شارع العقيد عميروش، عنابة 23000، الجزائر. الهاتف : <a dir="ltr" class="text-alert hover:underline" href="tel:+213559211315">+213 559 211 315</a> / <a dir="ltr" class="text-alert hover:underline" href="tel:+213783839004">+213 783 839 004</a> (تجاري)، <a dir="ltr" class="text-alert hover:underline" href="tel:+213660661432">+213 660 661 432</a> (تقني)، <a dir="ltr" class="text-alert hover:underline" href="tel:+21339522201">039 522 201</a> (ثابت).', // HTML
    'privacy.2': 'البيانات المجمَّعة', // Données collectées
    'privacy.3': 'عند تعبئة نموذج عرض السعر، نجمع المعلومات التي تزوّدنا بها: اسمك ورقم هاتفك ونوع المشروع ورسالتك. وإذا تواصلت معنا عبر الهاتف أو واتساب، فالمعلومات المتبادلة هي تلك التي ترسلها إلينا.', // Lorsque vous remplissez le formulaire de devis, nous recueillons les i
    'privacy.4': 'الغايات', // Finalités
    'privacy.5': 'تُستخدم هذه البيانات حصرًا للرد على طلبك والتواصل معك مجددًا وإعداد عرض السعر ومتابعة مشروعك. ولا تُباع ولا تُحال إلى أطراف ثالثة لأغراض تجارية.', // Ces données sont utilisées uniquement pour répondre à votre demande, v
    'privacy.6': 'مدة الاحتفاظ', // Durée de conservation
    'privacy.retention': 'يتم الاحتفاظ ببياناتك طوال المدة اللازمة لمعالجة طلبك ومتابعة العلاقة التجارية، أي <mark class="bg-yellow-200 text-navy-900 px-1 rounded">[À compléter : durée de conservation, par exemple 3 ans]</mark>.', // HTML
    'privacy.7': 'خدمات الأطراف الثالثة وملفات الكوكيز', // Services tiers et cookies
    'privacy.8': 'لا يستخدم هذا الموقع ملفات كوكيز إعلانية ولا أداة تتبّع خاصة به. ويحتفظ فقط باختيارك المتعلق بشريط المعلومات حول الكوكيز في التخزين المحلي لمتصفحك (يمكنك مسحه في أي وقت من إعدادات المتصفح). غير أنه يستعين بخدمات طرف ثالث قد تتلقى بيانات تقنية (عنوان IP، المتصفح) عند زيارتك للصفحة: خرائط Google (الخريطة والتقييمات)، وخطوط Google، ومكتبات مستضافة على شبكات CDN (Tailwind CSS وFont Awesome)، وواتساب عند النقر على زر التواصل. وتطبّق كل خدمة من هذه الخدمات سياسة الخصوصية الخاصة بها.', // Ce site n'utilise pas de cookies publicitaires ni d'outil de suivi pro
    'privacy.9': 'حقوقك', // Vos droits
    'privacy.rights': 'وفقًا للقانون رقم 18-07 المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي، يحق لك الاطلاع على بياناتك وتصحيحها والاعتراض عليها وحذفها. لممارسة هذه الحقوق، تواصل معنا عبر الهاتف على الرقم <a dir="ltr" class="text-alert hover:underline" href="tel:+213559211315">+213 559 211 315</a>، أو عبر واتساب، أو مباشرة في عنواننا بعنابة.', // HTML
    'privacy.10': 'الأمان', // Sécurité
    'privacy.11': 'نطبّق إجراءات معقولة لحماية معلوماتك من أي وصول غير مصرح به أو فقدان أو إفشاء.', // Nous mettons en œuvre des mesures raisonnables pour protéger vos infor
    'privacy.12': 'تعديل هذه السياسة', // Modification de cette politique
    'privacy.13': 'يمكن تحديث هذه السياسة لمراعاة تطورات الموقع أو التنظيم. ويظهر تاريخ آخر تحديث أعلى هذه الصفحة.', // Cette politique peut être mise à jour pour tenir compte d'évolutions d
  };

  /* ---------- Messages du JavaScript (fr / ar) ---------- */
  var UI = {
    fr: {
      'form.err_name': "Merci d'indiquer votre nom.",
      'form.err_phone': "Merci d'indiquer un numéro de téléphone valide.",
      'form.err_email': "Merci d'indiquer une adresse e-mail valide.",
      'form.err_project': 'Merci de sélectionner le type de projet / lieu.',
      'form.err_services': 'Merci de sélectionner au moins un service.',
      'form.btn_email': 'Envoyer par E-mail',
      'form.btn_whatsapp': 'Envoyer via WhatsApp',
      'form.sending': 'Envoi en cours…',
      'form.ok_whatsapp': "WhatsApp s'ouvre avec votre message prérempli : il ne reste qu'à l'envoyer.",
      'form.ok_email': 'Votre demande a bien été envoyée par e-mail. Nous vous recontactons très vite !',
      'wa.hello': 'Bonjour GROUP CAM, je souhaite recevoir un devis.',
      'wa.name': 'Nom',
      'wa.phone': 'Téléphone',
      'wa.project': 'Type de projet / lieu',
      'wa.services': 'Services souhaités',
      'wa.email': 'E-mail',
      'wa.message': 'Message',
      'carousel.dot': "Aller à l'avis {n}",
      'offers.cta': "Profiter de l'offre",
      'lang.switch': "Passer en arabe"
    },
    ar: {
      'form.err_name': 'يرجى إدخال اسمك.',
      'form.err_phone': 'يرجى إدخال رقم هاتف صالح.',
      'form.err_email': 'يرجى إدخال بريد إلكتروني صالح.',
      'form.err_project': 'يرجى اختيار نوع المشروع / الموقع.',
      'form.err_services': 'يرجى اختيار خدمة واحدة على الأقل.',
      'form.btn_email': 'إرسال عبر البريد الإلكتروني',
      'form.btn_whatsapp': 'إرسال عبر واتساب',
      'form.sending': 'جارٍ الإرسال…',
      'form.ok_whatsapp': 'سيتم فتح واتساب مع رسالتك الجاهزة، ما عليك سوى إرسالها.',
      'form.ok_email': 'تم إرسال طلبك بنجاح عبر البريد الإلكتروني. سنتواصل معك في أقرب وقت!',
      'wa.hello': 'مرحبًا GROUP CAM، أودّ الحصول على عرض سعر.',
      'wa.name': 'الاسم',
      'wa.phone': 'الهاتف',
      'wa.project': 'نوع المشروع / الموقع',
      'wa.services': 'الخدمات المطلوبة',
      'wa.email': 'البريد الإلكتروني',
      'wa.message': 'الرسالة',
      'carousel.dot': 'الانتقال إلى التقييم {n}',
      'offers.cta': 'الاستفادة من العرض',
      'lang.switch': 'التبديل إلى الفرنسية'
    }
  };

  var DICTIONARIES = { ar: AR };

  /* ---------- État ---------- */
  var originals = new WeakMap(); // élément → contenu français d'origine
  var currentLang = DEFAULT_LANG;

  function readStoredLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(stored) !== -1 ? stored : DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function storeLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* stockage indisponible */ }
  }

  /** Traduit une clé de message JavaScript. {n} est remplacé par vars.n, etc. */
  function t(key, vars) {
    var table = UI[currentLang] || UI[DEFAULT_LANG];
    var text = table[key] !== undefined ? table[key] : (UI[DEFAULT_LANG][key] || key);
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        text = text.replace('{' + name + '}', vars[name]);
      });
    }
    return text;
  }

  /* ---------- Application des traductions ---------- */
  function firstTextNode(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i];
      if (node.nodeType === 3 && node.nodeValue.trim()) return node;
    }
    return null;
  }

  function lookup(lang, key) {
    var dict = DICTIONARIES[lang];
    return dict ? dict[key] : undefined;
  }

  function translateTexts(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var node = firstTextNode(el);
      if (!node) return;
      var saved = originals.get(el);
      if (!saved) {
        saved = { node: node, fr: node.nodeValue };
        originals.set(el, saved);
      }
      var value = lang === DEFAULT_LANG ? undefined : lookup(lang, el.getAttribute('data-i18n'));
      if (value === undefined) {
        saved.node.nodeValue = saved.fr; // français (ou traduction absente)
      } else {
        var lead = saved.fr.match(/^\s*/)[0];
        var trail = saved.fr.match(/\s*$/)[0];
        saved.node.nodeValue = lead + value + trail;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var saved = originals.get(el);
      if (!saved) {
        saved = { html: el.innerHTML };
        originals.set(el, saved);
      }
      var value = lang === DEFAULT_LANG ? undefined : lookup(lang, el.getAttribute('data-i18n-html'));
      el.innerHTML = value === undefined ? saved.html : value;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var saved = originals.get(el);
      if (!saved) {
        saved = {};
        originals.set(el, saved);
      }
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        var attr = parts[0].trim();
        var key = parts[1] && parts[1].trim();
        if (!attr || !key) return;
        if (saved[attr] === undefined) saved[attr] = el.getAttribute(attr) || '';
        var value = lang === DEFAULT_LANG ? undefined : lookup(lang, key);
        el.setAttribute(attr, value === undefined ? saved[attr] : value);
      });
    });
  }

  /** Contenu français d'origine d'un élément (ex. libellé d'option envoyé par e-mail). */
  function originalText(el) {
    var saved = originals.get(el);
    if (saved && saved.fr !== undefined) return saved.fr.trim();
    return (el.textContent || '').trim();
  }

  /* ---------- Police arabe (chargée uniquement si nécessaire) ---------- */
  function loadArabicFont() {
    if (document.getElementById('font-arabic')) return;
    var link = document.createElement('link');
    link.id = 'font-arabic';
    link.rel = 'stylesheet';
    link.href = ARABIC_FONT_URL;
    document.head.appendChild(link);
  }

  /* ---------- Sélecteur de langue ---------- */
  function updateSwitches(lang) {
    document.querySelectorAll('[data-lang-switch]').forEach(function (btn) {
      btn.setAttribute('aria-label', UI[lang]['lang.switch']);
      btn.querySelectorAll('[data-lang-opt]').forEach(function (opt) {
        opt.classList.toggle('is-active', opt.getAttribute('data-lang-opt') === lang);
      });
    });
  }

  /* ---------- Changement de langue ---------- */
  function setLanguage(lang, persist) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    currentLang = lang;

    var root = document.documentElement;
    root.lang = lang;
    root.dir = RTL_LANGS.indexOf(lang) !== -1 ? 'rtl' : 'ltr';

    if (lang === 'ar') loadArabicFont();
    translateTexts(lang);
    updateSwitches(lang);
    if (persist) storeLang(lang);

    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'fr' ? 'ar' : 'fr', true);
  }

  /* ---------- Initialisation ---------- */
  currentLang = readStoredLang();

  function init() {
    document.querySelectorAll('[data-lang-switch]').forEach(function (btn) {
      btn.addEventListener('click', toggleLanguage);
    });
    setLanguage(currentLang, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* API publique */
  window.I18N = {
    t: t,
    originalText: originalText,
    get lang() { return currentLang; },
    set: function (lang) { setLanguage(lang, true); }
  };
})();
