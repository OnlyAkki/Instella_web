"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Translation {
  [key: string]: string
}

interface Translations {
  [language: string]: Translation
}

const translations: Translations = {
  en: {
    // Header
    home: "Home",
    downloads: "Downloads",
    backups: "Backups",
    flags: "Flags",

    // Home page
    heroTitle: "Instella App",
    heroSubtitle: "The Best iOS-style Instagram for Android!",
    downloadNow: "Download Now",
    whyChoose: "Why Choose Instella?",
    whyChooseSubtitle: "Experience Instagram like never before with our enhanced features and optimizations.",
    fasterUpdates: "Faster Updates",
    fasterUpdatesDesc: "Get the latest features and bug fixes delivered quickly to your device.",
    support32bit: "32-bit Support",
    support32bitDesc: "Compatible with a wider range of Android devices, including older hardware.",
    cloneSupport: "Clone Support",
    cloneSupportDesc: "Run multiple instances of Instagram on a single device seamlessly.",
    adFree: "Ad-Free Experience",
    adFreeDesc: "Enjoy Instagram without interruptions from advertisements.",
    madeWith: "Made with",
    by: "by Instella Team.",

    // Downloads page
    select32bit: "Select 32-bit",
    select64bit: "Select 64-bit",
    version32bit: "32-bit Version",
    version64bit: "64-bit Version",
    compatibleOlder: "Compatible with older devices and specific hardware configurations.",
    recommendedModern: "Recommended for most modern Android devices with better performance.",
    versionSelected: "-bit Version Selected",
    chooseBetween: "Choose between Clone and Standard versions",
    cloneVersion: "Clone Version",
    standardVersion: "Standard Version",
    runMultiple: "Run multiple Instagram instances on your device",
    standardSingle: "Standard single-instance version",
    downloadClone: "Download Clone",
    downloadStandard: "Download Standard",
    downloading: "Downloading...",
    released: "Released:",
    filesAvailable: "files available",
    releaseNotes: "Release Notes",
    otherVersions: "Other Versions",
    noReleases: "No Releases Found",
    checkBackLater: "Please check back later for updates.",
    loading: "Loading...",
    loadingReleases: "Loading releases...",

    // Backups page
    backupLibrary: "Backup Library",
    backupLibraryDesc: "Browse and download community-created backups for Instella App.",
    communityBackup: "Community Backup",
    viewDetails: "View details and download this backup configuration.",
    viewBackup: "View Backup",
    noBackups: "No Backups Found",
    checkBackBackups: "Check back later for community backups.",
    loadingBackups: "Loading backups...",
    loadingBackup: "Loading backup...",

    // Backup details
    backToBackups: "Back to Backups",
    backupDetails: "Backup Details",
    author: "Author:",
    updated: "Updated:",
    version: "Version:",
    backup: "Backup",
    description: "Description",
    changelog: "Changelog",
    downloadBackupFile: "Download Backup File",
    backupNotFound: "Could not load backup details",
    backupMightNotExist: "The backup might not exist or there was an error loading it.",

    // Flags page
    underDevelopment: "🚧 Under Development 🚧",
    flagsPageDesc: "The Flags page is currently being developed. Check back soon for exciting new features!",
    comingSoon: "Coming Soon",

    // Common
    na: "N/A",
  },
  es: {
    // Header
    home: "Inicio",
    downloads: "Descargas",
    backups: "Respaldos",
    flags: "Banderas",

    // Home page
    heroTitle: "Instella App",
    heroSubtitle: "¡El mejor Instagram estilo iOS para Android!",
    downloadNow: "Descargar Ahora",
    whyChoose: "¿Por qué elegir Instella?",
    whyChooseSubtitle: "Experimenta Instagram como nunca antes con nuestras funciones mejoradas y optimizaciones.",
    fasterUpdates: "Actualizaciones Más Rápidas",
    fasterUpdatesDesc: "Obtén las últimas funciones y correcciones de errores entregadas rápidamente a tu dispositivo.",
    support32bit: "Soporte de 32 bits",
    support32bitDesc: "Compatible con una gama más amplia de dispositivos Android, incluido hardware más antiguo.",
    cloneSupport: "Soporte de Clonación",
    cloneSupportDesc: "Ejecuta múltiples instancias de Instagram en un solo dispositivo sin problemas.",
    adFree: "Experiencia Sin Anuncios",
    adFreeDesc: "Disfruta de Instagram sin interrupciones de anuncios.",
    madeWith: "Hecho con",
    by: "por el equipo de Instella.",

    // Downloads page
    select32bit: "Seleccionar 32 bits",
    select64bit: "Seleccionar 64 bits",
    version32bit: "Versión de 32 bits",
    version64bit: "Versión de 64 bits",
    compatibleOlder: "Compatible con dispositivos más antiguos y configuraciones de hardware específicas.",
    recommendedModern: "Recomendado para la mayoría de dispositivos Android modernos con mejor rendimiento.",
    versionSelected: " bits Versión Seleccionada",
    chooseBetween: "Elige entre versiones Clone y Standard",
    cloneVersion: "Versión Clone",
    standardVersion: "Versión Standard",
    runMultiple: "Ejecuta múltiples instancias de Instagram en tu dispositivo",
    standardSingle: "Versión estándar de instancia única",
    downloadClone: "Descargar Clone",
    downloadStandard: "Descargar Standard",
    downloading: "Descargando...",
    released: "Lanzado:",
    filesAvailable: "archivos disponibles",
    releaseNotes: "Notas de Lanzamiento",
    otherVersions: "Otras Versiones",
    noReleases: "No se Encontraron Lanzamientos",
    checkBackLater: "Por favor, vuelve más tarde para actualizaciones.",
    loading: "Cargando...",
    loadingReleases: "Cargando lanzamientos...",

    // Backups page
    backupLibrary: "Biblioteca de Respaldos",
    backupLibraryDesc: "Navega y descarga respaldos creados por la comunidad para Instella App.",
    communityBackup: "Respaldo de la Comunidad",
    viewDetails: "Ver detalles y descargar esta configuración de respaldo.",
    viewBackup: "Ver Respaldo",
    noBackups: "No se Encontraron Respaldos",
    checkBackBackups: "Vuelve más tarde para respaldos de la comunidad.",
    loadingBackups: "Cargando respaldos...",
    loadingBackup: "Cargando respaldo...",

    // Backup details
    backToBackups: "Volver a Respaldos",
    backupDetails: "Detalles del Respaldo",
    author: "Autor:",
    updated: "Actualizado:",
    version: "Versión:",
    backup: "Respaldo",
    description: "Descripción",
    changelog: "Registro de Cambios",
    downloadBackupFile: "Descargar Archivo de Respaldo",
    backupNotFound: "No se pudieron cargar los detalles del respaldo",
    backupMightNotExist: "El respaldo podría no existir o hubo un error al cargarlo.",

    // Flags page
    underDevelopment: "🚧 En Desarrollo 🚧",
    flagsPageDesc:
      "La página de Banderas está actualmente en desarrollo. ¡Vuelve pronto para nuevas funciones emocionantes!",
    comingSoon: "Próximamente",

    // Common
    na: "N/A",
  },
  fr: {
    // Header
    home: "Accueil",
    downloads: "Téléchargements",
    backups: "Sauvegardes",
    flags: "Drapeaux",

    // Home page
    heroTitle: "Instella App",
    heroSubtitle: "Le meilleur Instagram style iOS pour Android !",
    downloadNow: "Télécharger Maintenant",
    whyChoose: "Pourquoi choisir Instella ?",
    whyChooseSubtitle:
      "Découvrez Instagram comme jamais auparavant avec nos fonctionnalités améliorées et optimisations.",
    fasterUpdates: "Mises à Jour Plus Rapides",
    fasterUpdatesDesc:
      "Obtenez les dernières fonctionnalités et corrections de bugs livrées rapidement sur votre appareil.",
    support32bit: "Support 32 bits",
    support32bitDesc: "Compatible avec une gamme plus large d'appareils Android, y compris le matériel plus ancien.",
    cloneSupport: "Support de Clonage",
    cloneSupportDesc: "Exécutez plusieurs instances d'Instagram sur un seul appareil en toute transparence.",
    adFree: "Expérience Sans Publicité",
    adFreeDesc: "Profitez d'Instagram sans interruptions publicitaires.",
    madeWith: "Fait avec",
    by: "par l'équipe Instella.",

    // Downloads page
    select32bit: "Sélectionner 32 bits",
    select64bit: "Sélectionner 64 bits",
    version32bit: "Version 32 bits",
    version64bit: "Version 64 bits",
    compatibleOlder: "Compatible avec les appareils plus anciens et les configurations matérielles spécifiques.",
    recommendedModern: "Recommandé pour la plupart des appareils Android modernes avec de meilleures performances.",
    versionSelected: " bits Version Sélectionnée",
    chooseBetween: "Choisissez entre les versions Clone et Standard",
    cloneVersion: "Version Clone",
    standardVersion: "Version Standard",
    runMultiple: "Exécutez plusieurs instances d'Instagram sur votre appareil",
    standardSingle: "Version standard à instance unique",
    downloadClone: "Télécharger Clone",
    downloadStandard: "Télécharger Standard",
    downloading: "Téléchargement...",
    released: "Publié :",
    filesAvailable: "fichiers disponibles",
    releaseNotes: "Notes de Version",
    otherVersions: "Autres Versions",
    noReleases: "Aucune Version Trouvée",
    checkBackLater: "Veuillez revenir plus tard pour les mises à jour.",
    loading: "Chargement...",
    loadingReleases: "Chargement des versions...",

    // Backups page
    backupLibrary: "Bibliothèque de Sauvegardes",
    backupLibraryDesc: "Parcourez et téléchargez les sauvegardes créées par la communauté pour Instella App.",
    communityBackup: "Sauvegarde Communautaire",
    viewDetails: "Voir les détails et télécharger cette configuration de sauvegarde.",
    viewBackup: "Voir la Sauvegarde",
    noBackups: "Aucune Sauvegarde Trouvée",
    checkBackBackups: "Revenez plus tard pour les sauvegardes communautaires.",
    loadingBackups: "Chargement des sauvegardes...",
    loadingBackup: "Chargement de la sauvegarde...",

    // Backup details
    backToBackups: "Retour aux Sauvegardes",
    backupDetails: "Détails de la Sauvegarde",
    author: "Auteur :",
    updated: "Mis à jour :",
    version: "Version :",
    backup: "Sauvegarde",
    description: "Description",
    changelog: "Journal des Modifications",
    downloadBackupFile: "Télécharger le Fichier de Sauvegarde",
    backupNotFound: "Impossible de charger les détails de la sauvegarde",
    backupMightNotExist: "La sauvegarde pourrait ne pas exister ou il y a eu une erreur lors du chargement.",

    // Flags page
    underDevelopment: "🚧 En Développement 🚧",
    flagsPageDesc:
      "La page Drapeaux est actuellement en développement. Revenez bientôt pour de nouvelles fonctionnalités passionnantes !",
    comingSoon: "Bientôt Disponible",

    // Common
    na: "N/A",
  },
  de: {
    // Header
    home: "Startseite",
    downloads: "Downloads",
    backups: "Backups",
    flags: "Flaggen",

    // Home page
    heroTitle: "Instella App",
    heroSubtitle: "Das beste iOS-Style Instagram für Android!",
    downloadNow: "Jetzt Herunterladen",
    whyChoose: "Warum Instella wählen?",
    whyChooseSubtitle: "Erleben Sie Instagram wie nie zuvor mit unseren erweiterten Funktionen und Optimierungen.",
    fasterUpdates: "Schnellere Updates",
    fasterUpdatesDesc: "Erhalten Sie die neuesten Funktionen und Fehlerbehebungen schnell auf Ihr Gerät.",
    support32bit: "32-Bit-Unterstützung",
    support32bitDesc: "Kompatibel mit einer breiteren Palette von Android-Geräten, einschließlich älterer Hardware.",
    cloneSupport: "Klon-Unterstützung",
    cloneSupportDesc: "Führen Sie mehrere Instagram-Instanzen nahtlos auf einem einzigen Gerät aus.",
    adFree: "Werbefreie Erfahrung",
    adFreeDesc: "Genießen Sie Instagram ohne Unterbrechungen durch Werbung.",
    madeWith: "Gemacht mit",
    by: "vom Instella-Team.",

    // Downloads page
    select32bit: "32-Bit auswählen",
    select64bit: "64-Bit auswählen",
    version32bit: "32-Bit-Version",
    version64bit: "64-Bit-Version",
    compatibleOlder: "Kompatibel mit älteren Geräten und spezifischen Hardware-Konfigurationen.",
    recommendedModern: "Empfohlen für die meisten modernen Android-Geräte mit besserer Leistung.",
    versionSelected: "-Bit-Version Ausgewählt",
    chooseBetween: "Wählen Sie zwischen Klon- und Standard-Versionen",
    cloneVersion: "Klon-Version",
    standardVersion: "Standard-Version",
    runMultiple: "Führen Sie mehrere Instagram-Instanzen auf Ihrem Gerät aus",
    standardSingle: "Standard-Einzelinstanz-Version",
    downloadClone: "Klon Herunterladen",
    downloadStandard: "Standard Herunterladen",
    downloading: "Herunterladen...",
    released: "Veröffentlicht:",
    filesAvailable: "Dateien verfügbar",
    releaseNotes: "Versionshinweise",
    otherVersions: "Andere Versionen",
    noReleases: "Keine Versionen Gefunden",
    checkBackLater: "Bitte schauen Sie später für Updates vorbei.",
    loading: "Laden...",
    loadingReleases: "Lade Versionen...",

    // Backups page
    backupLibrary: "Backup-Bibliothek",
    backupLibraryDesc: "Durchsuchen und laden Sie von der Community erstellte Backups für Instella App herunter.",
    communityBackup: "Community-Backup",
    viewDetails: "Details anzeigen und diese Backup-Konfiguration herunterladen.",
    viewBackup: "Backup Anzeigen",
    noBackups: "Keine Backups Gefunden",
    checkBackBackups: "Schauen Sie später für Community-Backups vorbei.",
    loadingBackups: "Lade Backups...",
    loadingBackup: "Lade Backup...",

    // Backup details
    backToBackups: "Zurück zu Backups",
    backupDetails: "Backup-Details",
    author: "Autor:",
    updated: "Aktualisiert:",
    version: "Version:",
    backup: "Backup",
    description: "Beschreibung",
    changelog: "Änderungsprotokoll",
    downloadBackupFile: "Backup-Datei Herunterladen",
    backupNotFound: "Backup-Details konnten nicht geladen werden",
    backupMightNotExist: "Das Backup existiert möglicherweise nicht oder es gab einen Fehler beim Laden.",

    // Flags page
    underDevelopment: "🚧 In Entwicklung 🚧",
    flagsPageDesc: "Die Flaggen-Seite wird derzeit entwickelt. Schauen Sie bald für aufregende neue Funktionen vorbei!",
    comingSoon: "Demnächst Verfügbar",

    // Common
    na: "N/A",
  },
  pt: {
    // Header
    home: "Início",
    downloads: "Downloads",
    backups: "Backups",
    flags: "Bandeiras",

    // Home page
    heroTitle: "Instella App",
    heroSubtitle: "O melhor Instagram estilo iOS para Android!",
    downloadNow: "Baixar Agora",
    whyChoose: "Por que escolher Instella?",
    whyChooseSubtitle: "Experimente o Instagram como nunca antes com nossos recursos aprimorados e otimizações.",
    fasterUpdates: "Atualizações Mais Rápidas",
    fasterUpdatesDesc:
      "Obtenha os recursos mais recentes e correções de bugs entregues rapidamente ao seu dispositivo.",
    support32bit: "Suporte 32 bits",
    support32bitDesc: "Compatível com uma gama mais ampla de dispositivos Android, incluindo hardware mais antigo.",
    cloneSupport: "Suporte de Clone",
    cloneSupportDesc: "Execute várias instâncias do Instagram em um único dispositivo perfeitamente.",
    adFree: "Experiência Sem Anúncios",
    adFreeDesc: "Desfrute do Instagram sem interrupções de anúncios.",
    madeWith: "Feito com",
    by: "pela equipe Instella.",

    // Downloads page
    select32bit: "Selecionar 32 bits",
    select64bit: "Selecionar 64 bits",
    version32bit: "Versão 32 bits",
    version64bit: "Versão 64 bits",
    compatibleOlder: "Compatível com dispositivos mais antigos e configurações de hardware específicas.",
    recommendedModern: "Recomendado para a maioria dos dispositivos Android modernos com melhor desempenho.",
    versionSelected: " bits Versão Selecionada",
    chooseBetween: "Escolha entre versões Clone e Padrão",
    cloneVersion: "Versão Clone",
    standardVersion: "Versão Padrão",
    runMultiple: "Execute várias instâncias do Instagram no seu dispositivo",
    standardSingle: "Versão padrão de instância única",
    downloadClone: "Baixar Clone",
    downloadStandard: "Baixar Padrão",
    downloading: "Baixando...",
    released: "Lançado:",
    filesAvailable: "arquivos disponíveis",
    releaseNotes: "Notas de Lançamento",
    otherVersions: "Outras Versões",
    noReleases: "Nenhum Lançamento Encontrado",
    checkBackLater: "Por favor, volte mais tarde para atualizações.",
    loading: "Carregando...",
    loadingReleases: "Carregando lançamentos...",

    // Backups page
    backupLibrary: "Biblioteca de Backups",
    backupLibraryDesc: "Navegue e baixe backups criados pela comunidade para Instella App.",
    communityBackup: "Backup da Comunidade",
    viewDetails: "Ver detalhes e baixar esta configuração de backup.",
    viewBackup: "Ver Backup",
    noBackups: "Nenhum Backup Encontrado",
    checkBackBackups: "Volte mais tarde para backups da comunidade.",
    loadingBackups: "Carregando backups...",
    loadingBackup: "Carregando backup...",

    // Backup details
    backToBackups: "Voltar aos Backups",
    backupDetails: "Detalhes do Backup",
    author: "Autor:",
    updated: "Atualizado:",
    version: "Versão:",
    backup: "Backup",
    description: "Descrição",
    changelog: "Registro de Alterações",
    downloadBackupFile: "Baixar Arquivo de Backup",
    backupNotFound: "Não foi possível carregar os detalhes do backup",
    backupMightNotExist: "O backup pode não existir ou houve um erro ao carregá-lo.",

    // Flags page
    underDevelopment: "🚧 Em Desenvolvimento 🚧",
    flagsPageDesc:
      "A página de Bandeiras está atualmente sendo desenvolvida. Volte em breve para novos recursos emocionantes!",
    comingSoon: "Em Breve",

    // Common
    na: "N/A",
  },
  hi: {
    // Header
    home: "होम",
    downloads: "डाउनलोड",
    backups: "बैकअप",
    flags: "फ्लैग्स",

    // Home page
    heroTitle: "Instella App",
    heroSubtitle: "Android के लिए सबसे अच्छा iOS-स्टाइल Instagram!",
    downloadNow: "अभी डाउनलोड करें",
    whyChoose: "Instella क्यों चुनें?",
    whyChooseSubtitle: "हमारी बेहतर सुविधाओं और अनुकूलन के साथ Instagram का अनुभव पहले जैसा कभी नहीं करें।",
    fasterUpdates: "तेज़ अपडेट",
    fasterUpdatesDesc: "अपने डिवाइस पर नवीनतम सुविधाएं और बग फिक्स तुरंत प्राप्त करें।",
    support32bit: "32-बिट समर्थन",
    support32bitDesc: "पुराने हार्डवेयर सहित Android डिवाइसों की व्यापक श्रृंखला के साथ संगत।",
    cloneSupport: "क्लोन समर्थन",
    cloneSupportDesc: "एक ही डिवाइस पर Instagram के कई इंस्टेंस निर्बाध रूप से चलाएं।",
    adFree: "विज्ञापन-मुक्त अनुभव",
    adFreeDesc: "विज्ञापनों की बाधा के बिना Instagram का आनंद लें।",
    madeWith: "के साथ बनाया गया",
    by: "Instella टीम द्वारा।",

    // Downloads page
    select32bit: "32-बिट चुनें",
    select64bit: "64-बिट चुनें",
    version32bit: "32-बिट संस्करण",
    version64bit: "64-बिट संस्करण",
    compatibleOlder: "पुराने डिवाइसों और विशिष्ट हार्डवेयर कॉन्फ़िगरेशन के साथ संगत।",
    recommendedModern: "बेहतर प्रदर्शन के साथ अधिकांश आधुनिक Android डिवाइसों के लिए अनुशंसित।",
    versionSelected: "-बिट संस्करण चयनित",
    chooseBetween: "क्लोन और स्टैंडर्ड संस्करणों के बीच चुनें",
    cloneVersion: "क्लोन संस्करण",
    standardVersion: "स्टैंडर्ड संस्करण",
    runMultiple: "अपने डिवाइस पर Instagram के कई इंस्टेंस चलाएं",
    standardSingle: "स्टैंडर्ड सिंगल-इंस्टेंस संस्करण",
    downloadClone: "क्लोन डाउनलोड करें",
    downloadStandard: "स्टैंडर्ड डाउनलोड करें",
    downloading: "डाउनलोड हो रहा है...",
    released: "रिलीज़:",
    filesAvailable: "फाइलें उपलब्ध",
    releaseNotes: "रिलीज़ नोट्स",
    otherVersions: "अन्य संस्करण",
    noReleases: "कोई रिलीज़ नहीं मिली",
    checkBackLater: "कृपया अपडेट के लिए बाद में वापस आएं।",
    loading: "लोड हो रहा है...",
    loadingReleases: "रिलीज़ लोड हो रही हैं...",

    // Backups page
    backupLibrary: "बैकअप लाइब्रेरी",
    backupLibraryDesc: "Instella App के लिए समुदाय द्वारा बनाए गए बैकअप ब्राउज़ करें और डाउनलोड करें।",
    communityBackup: "समुदायिक बैकअप",
    viewDetails: "विवरण देखें और इस बैकअप कॉन्फ़िगरेशन को डाउनलोड करें।",
    viewBackup: "बैकअप देखें",
    noBackups: "कोई बैकअप नहीं मिला",
    checkBackBackups: "समुदायिक बैकअप के लिए बाद में वापस आएं।",
    loadingBackups: "बैकअप लोड हो रहे हैं...",
    loadingBackup: "बैकअप लोड हो रहा है...",

    // Backup details
    backToBackups: "बैकअप पर वापस जाएं",
    backupDetails: "बैकअप विवरण",
    author: "लेखक:",
    updated: "अपडेट किया गया:",
    version: "संस्करण:",
    backup: "बैकअप",
    description: "विवरण",
    changelog: "परिवर्तन लॉग",
    downloadBackupFile: "बैकअप फाइल डाउनलोड करें",
    backupNotFound: "बैकअप विवरण लोड नहीं हो सके",
    backupMightNotExist: "बैकअप मौजूद नहीं हो सकता या इसे लोड करने में त्रुटि हुई।",

    // Flags page
    underDevelopment: "🚧 विकास में 🚧",
    flagsPageDesc: "फ्लैग्स पेज वर्तमान में विकसित हो रहा है। रोमांचक नई सुविधाओं के लिए जल्द ही वापस आएं!",
    comingSoon: "जल्द आ रहा है",

    // Common
    na: "N/A",
  },
  ar: {
    // Header
    home: "الرئيسية",
    downloads: "التحميلات",
    backups: "النسخ الاحتياطية",
    flags: "الأعلام",

    // Home page
    heroTitle: "تطبيق Instella",
    heroSubtitle: "أفضل Instagram بنمط iOS لنظام Android!",
    downloadNow: "تحميل الآن",
    whyChoose: "لماذا تختار Instella؟",
    whyChooseSubtitle: "اختبر Instagram كما لم تفعل من قبل مع ميزاتنا المحسنة والتحسينات.",
    fasterUpdates: "تحديثات أسرع",
    fasterUpdatesDesc: "احصل على أحدث الميزات وإصلاحات الأخطاء المقدمة بسرعة إلى جهازك.",
    support32bit: "دعم 32 بت",
    support32bitDesc: "متوافق مع مجموعة أوسع من أجهزة Android، بما في ذلك الأجهزة القديمة.",
    cloneSupport: "دعم الاستنساخ",
    cloneSupportDesc: "قم بتشغيل عدة مثيلات من Instagram على جهاز واحد بسلاسة.",
    adFree: "تجربة خالية من الإعلانات",
    adFreeDesc: "استمتع بـ Instagram دون انقطاع من الإعلانات.",
    madeWith: "صُنع بـ",
    by: "من قبل فريق Instella.",

    // Downloads page
    select32bit: "اختر 32 بت",
    select64bit: "اختر 64 بت",
    version32bit: "إصدار 32 بت",
    version64bit: "إصدار 64 بت",
    compatibleOlder: "متوافق مع الأجهزة القديمة وتكوينات الأجهزة المحددة.",
    recommendedModern: "موصى به لمعظم أجهزة Android الحديثة مع أداء أفضل.",
    versionSelected: "إصدار -بت محدد",
    chooseBetween: "اختر بين إصدارات Clone و Standard",
    cloneVersion: "إصدار Clone",
    standardVersion: "إصدار Standard",
    runMultiple: "قم بتشغيل عدة مثيلات من Instagram على جهازك",
    standardSingle: "إصدار قياسي بمثيل واحد",
    downloadClone: "تحميل Clone",
    downloadStandard: "تحميل Standard",
    downloading: "جاري التحميل...",
    released: "تم الإصدار:",
    filesAvailable: "ملفات متاحة",
    releaseNotes: "ملاحظات الإصدار",
    otherVersions: "إصدارات أخرى",
    noReleases: "لم يتم العثور على إصدارات",
    checkBackLater: "يرجى العودة لاحقاً للتحديثات.",
    loading: "جاري التحميل...",
    loadingReleases: "جاري تحميل الإصدارات...",

    // Backups page
    backupLibrary: "مكتبة النسخ الاحتياطية",
    backupLibraryDesc: "تصفح وحمل النسخ الاحتياطية التي أنشأها المجتمع لتطبيق Instella.",
    communityBackup: "نسخة احتياطية من المجتمع",
    viewDetails: "عرض التفاصيل وتحميل تكوين النسخة الاحتياطية هذا.",
    viewBackup: "عرض النسخة الاحتياطية",
    noBackups: "لم يتم العثور على نسخ احتياطية",
    checkBackBackups: "عد لاحقاً للنسخ الاحتياطية من المجتمع.",
    loadingBackups: "جاري تحميل النسخ الاحتياطية...",
    loadingBackup: "جاري تحميل النسخة الاحتياطية...",

    // Backup details
    backToBackups: "العودة إلى النسخ الاحتياطية",
    backupDetails: "تفاصيل النسخة الاحتياطية",
    author: "المؤلف:",
    updated: "محدث:",
    version: "الإصدار:",
    backup: "نسخة احتياطية",
    description: "الوصف",
    changelog: "سجل التغييرات",
    downloadBackupFile: "تحميل ملف النسخة الاحتياطية",
    backupNotFound: "تعذر تحميل تفاصيل النسخة الاحتياطية",
    backupMightNotExist: "قد لا تكون النسخة الاحتياطية موجودة أو حدث خطأ في تحميلها.",

    // Flags page
    underDevelopment: "🚧 قيد التطوير 🚧",
    flagsPageDesc: "صفحة الأعلام قيد التطوير حالياً. عد قريباً لميزات جديدة مثيرة!",
    comingSoon: "قريباً",

    // Common
    na: "غير متاح",
  },
}

interface TranslationContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("instella-language")
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("instella-language", lang)
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
