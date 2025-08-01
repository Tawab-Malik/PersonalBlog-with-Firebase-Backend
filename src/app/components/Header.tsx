"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import AuthManager from "@/app/components/AuthManager";
import UserProfile from "@/app/components/UserProfile";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import LanguageDropdown from "@/app/components/LanguageDropDown";
import NotificationSystem from "@/app/components/NotificationSystem";
import { auth } from "../../../firebase/config";

interface MenuItem {
    label: string;
    href?: string;
    dropdown?: { label: string; href: string }[];
}

interface MobileDropdownItemProps {
    item: MenuItem;
    onClose: () => void;
}

const MobileDropdownItem = ({ item, onClose }: MobileDropdownItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary rounded-lg transition-colors duration-200 font-medium"
            >
                {item.label}
                <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <polyline points="6,9 12,15 18,9"></polyline>
                </motion.svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 space-y-1 overflow-hidden"
                    >
                        {item.dropdown?.map((dropdownItem) => (
                            <Link
                                key={dropdownItem.label}
                                href={dropdownItem.href}
                                className="block py-2 px-4 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                onClick={() => {
                                    onClose();
                                    setIsOpen(false);
                                }}
                            >
                                {dropdownItem.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const menuItems: MenuItem[] = [
    {
        label: "Home",
        href: "/",
        dropdown: [
            { label: "Dashboard", href: "/dashboard" },
            { label: "Profile", href: "/profile" },
            { label: "Settings", href: "/settings" },
        ],
    },
    {
        label: "About Us",
        href: "/about",
        
    },
    {
        label: "Categories",
        dropdown: [
            { label: "Technology", href: "/categories/technology" },
            { label: "Design", href: "/categories/design" },
            { label: "Business", href: "/categories/business" },
            { label: "Lifestyle", href: "/categories/lifestyle" },
        ],
    },
    {
        label: "Authors",
        href: "/authors",
    },
    {
        label: "Contact",
        href: "/contact",
        dropdown: [
            { label: "Support", href: "/support" },
            { label: "Feedback", href: "/feedback" },
        
        ],
    },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [user, setUser] = useState<{ uid: string; email: string | null; displayName: string | null; photoURL: string | null } | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleMouseEnter = (label: string) => {
        setActiveDropdown(label);
    };

    const handleMouseLeave = () => {
        setActiveDropdown(null);
    };

    
    return (
        <header className="bg-white  sticky top-0 z-20 font-primary">
            <div className="  flex flex-row md:flex-col justify-between items-center">
                <div className="max-w-7xl mx-auto px-4 w-full">
                    <div className="flex justify-between py-3 items-center w-full">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-nunito font-bold text-indigo-600">
                            <Image src="/images/logo.webp" className="w-[100px] h-[30px] md:w-[180px] md:h-[50px]" alt="TawabBlog" width={180} height={60} />
                        </Link>
                        <div className="flex items-center gap-x-0.5 md:gap-x-3">
                            <LanguageDropdown/>
                            {user && <NotificationSystem />}
                            {user ? (
                                <UserProfile />
                            ) : (
                                <Button
                                    onPress={() => setModalOpen(true)}
                                    className="bg-primary text-white hidden md:block hover:bg-primary-600 transition-colors duration-200"
                                >
                                    Login
                                </Button>
                            )}
                            
                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-gray-700 focus:outline-none"
                            onClick={() => setIsOpen(!isOpen)}>
                            <motion.svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </motion.svg>
                        </button>
                        </div>


                    </div>
                </div>


                {/* Desktop Nav */}
                <div className="w-full bg-primary py-3 hidden md:block !shadow-md ">
                    <nav className="flex gap-6 items-center justify-center max-w-7xl mx-auto px-4">
                        {menuItems.map((item) => (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => handleMouseEnter(item.label)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-1 text-white px-3 py-2 rounded-md transition-colors duration-200 ${activeDropdown === item.label
                                            ? ""
                                            : "text-white "
                                            }`}
                                    >
                                        {item.label}
                                        {item.dropdown && (
                                            <motion.svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                animate={{
                                                    rotate: activeDropdown === item.label ? 180 : 0,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <polyline points="6,9 12,15 18,9"></polyline>
                                            </motion.svg>
                                        )}
                                    </Link>
                                ) : (
                                    <button
                                        className={`flex items-center text-white gap-1 px-3 py-2 hover:bg-transparent rounded-md transition-colors duration-200 ${activeDropdown === item.label
                                            ? " bg-primary"
                                            : ""
                                            }`}
                                    >
                                        {item.label}
                                        {item.dropdown && (
                                            <motion.svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                animate={{
                                                    rotate: activeDropdown === item.label ? 180 : 0,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <polyline points="6,9 12,15 18,9"></polyline>
                                            </motion.svg>
                                        )}
                                    </button>
                                )}

                                {/* Dropdown Menu */}
                                {item.dropdown && (
                                    <AnimatePresence>
                                        {activeDropdown === item.label && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                                            >
                                                {item.dropdown.map((dropdownItem) => (
                                                    <Link
                                                        key={dropdownItem.label}
                                                        href={dropdownItem.href}
                                                        className="block px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white transition-colors duration-150"
                                                    >
                                                        {dropdownItem.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        ))}

                    </nav>
                </div>


                <AuthManager isOpen={modalOpen} onClose={() => setModalOpen(false)} initialMode="login" />

            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed top-0 left-0 h-full w-full bg-white shadow-xl z-50 md:hidden"
                        >
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">TM</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-800">TMx</span>
                                </div>
                                <div  className="block md:hidden" >
                                    <LanguageDropdown/>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="p-4 space-y-1">
                                {menuItems.map((item) => (
                                    <div key={item.label} className="mb-2">
                                        {item.dropdown ? (
                                            <MobileDropdownItem item={item} onClose={() => setIsOpen(false)} />
                                        ) : (
                                            <Link
                                                href={item.href || "#"}
                                                className="block py-3 px-4 text-gray-700 hover:bg-primary-50 hover:text-primary rounded-lg transition-colors duration-200 font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Sidebar Footer */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                {user ? (
                                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                            {user.photoURL ? (
                                                <Image
                                                    src={user.photoURL}
                                                    alt={user.displayName || user.email || ""}
                                                    className="w-8 h-8 rounded-full"
                                                    height={30}
                                                    width={30}
                                                />
                                            ) : (
                                                <span className="text-primary font-bold text-sm">
                                                    {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-white text-sm font-medium">
                                            {user.displayName || user.email?.split('@')[0]}
                                        </span>
                                    </div>
                                ) : (
                                    <Button
                                        onPress={() => {
                                            setModalOpen(true);
                                            setIsOpen(false);
                                        }}
                                        className="bg-gradient-to-r from-purple-600 to-blue-500 h-auto rounded-lg p-3 flex items-center gap-3 w-full"
                                    >
                                        <span className="text-white text-sm font-medium">Login</span>
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/*Start Header Language Script*/}
            <Script id={"widget-id"}>
                {`
           window.gtranslateSettings = {"default_language":"en","languages":["en","es","pl","de"],"wrapper_selector":".gtranslate_wrapper","switcher_horizontal_position":"inline","switcher_vertical_position":"top","float_switcher_open_direction":"bottom"};
          `}

            </Script>
            <Script id={"gt-widget-id"}>
                {`/*!Copyright (C) GTranslate Inc.*/
(function() {
    var gt = window.gtranslateSettings || {};
    gt = gt[document.currentScript.getAttribute('data-gt-widget-id')] || gt;
    var lang_array_english = {
        "af": "Afrikaans",
        "sq": "Albanian",
        "am": "Amharic",
        "ar": "Arabic",
        "hy": "Armenian",
        "az": "Azerbaijani",
        "eu": "Basque",
        "be": "Belarusian",
        "bn": "Bengali",
        "bs": "Bosnian",
        "bg": "Bulgarian",
        "ca": "Catalan",
        "ceb": "Cebuano",
        "ny": "Chichewa",
        "zh-CN": "Chinese (Simplified)",
        "zh-TW": "Chinese (Traditional)",
        "co": "Corsican",
        "hr": "Croatian",
        "cs": "Czech",
        "da": "Danish",
        "nl": "Dutch",
        "en": "English",
        "eo": "Esperanto",
        "et": "Estonian",
        "tl": "Filipino",
        "fi": "Finnish",
        "fr": "French",
        "fy": "Frisian",
        "gl": "Galician",
        "ka": "Georgian",
        "de": "German",
        "el": "Greek",
        "gu": "Gujarati",
        "ht": "Haitian Creole",
        "ha": "Hausa",
        "haw": "Hawaiian",
        "iw": "Hebrew",
        "hi": "Hindi",
        "hmn": "Hmong",
        "hu": "Hungarian",
        "is": "Icelandic",
        "ig": "Igbo",
        "id": "Indonesian",
        "ga": "Irish",
        "it": "Italian",
        "ja": "Japanese",
        "jw": "Javanese",
        "kn": "Kannada",
        "kk": "Kazakh",
        "km": "Khmer",
        "ko": "Korean",
        "ku": "Kurdish (Kurmanji)",
        "ky": "Kyrgyz",
        "lo": "Lao",
        "la": "Latin",
        "lv": "Latvian",
        "lt": "Lithuanian",
        "lb": "Luxembourgish",
        "mk": "Macedonian",
        "mg": "Malagasy",
        "ms": "Malay",
        "ml": "Malayalam",
        "mt": "Maltese",
        "mi": "Maori",
        "mr": "Marathi",
        "mn": "Mongolian",
        "my": "Myanmar (Burmese)",
        "ne": "Nepali",
        "no": "Norwegian",
        "ps": "Pashto",
        "fa": "Persian",
        "pl": "Polish",
        "pt": "Portuguese",
        "pa": "Punjabi",
        "ro": "Romanian",
        "ru": "Russian",
        "sm": "Samoan",
        "gd": "Scottish Gaelic",
        "sr": "Serbian",
        "st": "Sesotho",
        "sn": "Shona",
        "sd": "Sindhi",
        "si": "Sinhala",
        "sk": "Slovak",
        "sl": "Slovenian",
        "so": "Somali",
        "es": "Spanish",
        "su": "Sundanese",
        "sw": "Swahili",
        "sv": "Swedish",
        "tg": "Tajik",
        "ta": "Tamil",
        "te": "Telugu",
        "th": "Thai",
        "tr": "Turkish",
        "uk": "Ukrainian",
        "ur": "Urdu",
        "uz": "Uzbek",
        "vi": "Vietnamese",
        "cy": "Welsh",
        "xh": "Xhosa",
        "yi": "Yiddish",
        "yo": "Yoruba",
        "zu": "Zulu"
    };
    var lang_array_native = {
        "af": "Afrikaans",
        "sq": "Shqip",
        "am": "\u12a0\u121b\u122d\u129b",
        "ar": "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
        "hy": "\u0540\u0561\u0575\u0565\u0580\u0565\u0576",
        "az": "Az\u0259rbaycan dili",
        "eu": "Euskara",
        "be": "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f \u043c\u043e\u0432\u0430",
        "bn": "\u09ac\u09be\u0982\u09b2\u09be",
        "bs": "Bosanski",
        "bg": "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438",
        "ca": "Catal\u00e0",
        "ceb": "Cebuano",
        "ny": "Chichewa",
        "zh-CN": "\u7b80\u4f53\u4e2d\u6587",
        "zh-TW": "\u7e41\u9ad4\u4e2d\u6587",
        "co": "Corsu",
        "hr": "Hrvatski",
        "cs": "\u010ce\u0161tina\u200e",
        "da": "Dansk",
        "nl": "Nederlands",
        "en": "English",
        "eo": "Esperanto",
        "et": "Eesti",
        "tl": "Filipino",
        "fi": "Suomi",
        "fr": "Fran\u00e7ais",
        "fy": "Frysk",
        "gl": "Galego",
        "ka": "\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8",
        "de": "Deutsch",
        "el": "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",
        "gu": "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0",
        "ht": "Kreyol ayisyen",
        "ha": "Harshen Hausa",
        "haw": "\u014clelo Hawai\u02bbi",
        "iw": "\u05e2\u05b4\u05d1\u05b0\u05e8\u05b4\u05d9\u05ea",
        "hi": "\u0939\u093f\u0928\u094d\u0926\u0940",
        "hmn": "Hmong",
        "hu": "Magyar",
        "is": "\u00cdslenska",
        "ig": "Igbo",
        "id": "Bahasa Indonesia",
        "ga": "Gaeilge",
        "it": "Italiano",
        "ja": "\u65e5\u672c\u8a9e",
        "jw": "Basa Jawa",
        "kn": "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1",
        "kk": "\u049a\u0430\u0437\u0430\u049b \u0442\u0456\u043b\u0456",
        "km": "\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a",
        "ko": "\ud55c\uad6d\uc5b4",
        "ku": "\u0643\u0648\u0631\u062f\u06cc\u200e",
        "ky": "\u041a\u044b\u0440\u0433\u044b\u0437\u0447\u0430",
        "lo": "\u0e9e\u0eb2\u0eaa\u0eb2\u0ea5\u0eb2\u0ea7",
        "la": "Latin",
        "lv": "Latvie\u0161u valoda",
        "lt": "Lietuvi\u0173 kalba",
        "lb": "L\u00ebtzebuergesch",
        "mk": "\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438 \u0458\u0430\u0437\u0438\u043a",
        "mg": "Malagasy",
        "ms": "Bahasa Melayu",
        "ml": "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02",
        "mt": "Maltese",
        "mi": "Te Reo M\u0101ori",
        "mr": "\u092e\u0930\u093e\u0920\u0940",
        "mn": "\u041c\u043e\u043d\u0433\u043e\u043b",
        "my": "\u1017\u1019\u102c\u1005\u102c",
        "ne": "\u0928\u0947\u092a\u093e\u0932\u0940",
        "no": "Norsk bokm\u00e5l",
        "ps": "\u067e\u069a\u062a\u0648",
        "fa": "\u0641\u0627\u0631\u0633\u06cc",
        "pl": "Polski",
        "pt": "Portugu\u00eas",
        "pa": "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40",
        "ro": "Rom\u00e2n\u0103",
        "ru": "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
        "sm": "Samoan",
        "gd": "G\u00e0idhlig",
        "sr": "\u0421\u0440\u043f\u0441\u043a\u0438 \u0458\u0435\u0437\u0438\u043a",
        "st": "Sesotho",
        "sn": "Shona",
        "sd": "\u0633\u0646\u068c\u064a",
        "si": "\u0dc3\u0dd2\u0d82\u0dc4\u0dbd",
        "sk": "Sloven\u010dina",
        "sl": "Sloven\u0161\u010dina",
        "so": "Afsoomaali",
        "es": "Espa\u00f1ol",
        "su": "Basa Sunda",
        "sw": "Kiswahili",
        "sv": "Svenska",
        "tg": "\u0422\u043e\u04b7\u0438\u043a\u04e3",
        "ta": "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd",
        "te": "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41",
        "th": "\u0e44\u0e17\u0e22",
        "tr": "T\u00fcrk\u00e7e",
        "uk": "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430",
        "ur": "\u0627\u0631\u062f\u0648",
        "uz": "O\u2018zbekcha",
        "vi": "Ti\u1ebfng Vi\u1ec7t",
        "cy": "Cymraeg",
        "xh": "isiXhosa",
        "yi": "\u05d9\u05d9\u05d3\u05d9\u05e9",
        "yo": "Yor\u00f9b\u00e1",
        "zu": "Zulu"
    };
    var default_language = gt.default_language || 'auto';
    var languages = gt.languages || Object.keys(lang_array_english);
    var alt_flags = gt.alt_flags || {};
    var flag_style = gt.flag_style || '2d';
    var flags_location = gt.flags_location || 'https://cdn.gtranslate.net/flags/';
    var url_structure = gt.url_structure || 'none';
    var custom_domains = gt.custom_domains || {};
    var switcher_horizontal_position = gt.switcher_horizontal_position || 'left';
    var switcher_vertical_position = gt.switcher_vertical_position || 'bottom';
    var float_switcher_open_direction = gt.float_switcher_open_direction || 'top';
    var native_language_names = gt.native_language_names || false;
    var detect_browser_language = gt.detect_browser_language || false;
    var wrapper_selector = gt.wrapper_selector || '.gtranslate_wrapper';
    var custom_css = gt.custom_css || '';
    var lang_array = native_language_names && lang_array_native || lang_array_english;
    var u_class = '.gt_container-' + Array.from('float' + wrapper_selector).reduce(function(h, c) {
        return 0 | (31 * h + c.charCodeAt(0))
    }, 0).toString(36);
    var widget_code = '<!-- GTranslate: https://gtranslate.com -->';
    var widget_css = custom_css;
    flags_location += (flag_style == '3d' ? 32 : 'svg') + '/';
    var flag_ext = flag_style == '3d' ? '.png' : '.svg';

    function get_flag_src(lang) {
        if (!alt_flags[lang])
            return flags_location + lang + flag_ext;
        else if (alt_flags[lang] == 'usa')
            return flags_location + 'en-us' + flag_ext;
        else if (alt_flags[lang] == 'canada')
            return flags_location + 'en-ca' + flag_ext;
        else if (alt_flags[lang] == 'brazil')
            return flags_location + 'pt-br' + flag_ext;
        else if (alt_flags[lang] == 'mexico')
            return flags_location + 'es-mx' + flag_ext;
        else if (alt_flags[lang] == 'argentina')
            return flags_location + 'es-ar' + flag_ext;
        else if (alt_flags[lang] == 'colombia')
            return flags_location + 'es-co' + flag_ext;
        else if (alt_flags[lang] == 'quebec')
            return flags_location + 'fr-qc' + flag_ext;
        else
            return alt_flags[lang];
    }

    function get_lang_href(lang) {
        var href = '#';
        if (url_structure == 'sub_directory') {
            var gt_request_uri = (document.currentScript.getAttribute('data-gt-orig-url') || (location.pathname.startsWith('/' + current_lang + '/') && '/' + location.pathname.split('/').slice(2).join('/') || location.pathname)) + location.search + location.hash;
            href = (lang == default_language) && location.protocol + '//' + location.hostname + gt_request_uri || location.protocol + '//' + location.hostname + '/' + lang + gt_request_uri;
        } else if (url_structure == 'sub_domain') {
            var gt_request_uri = (document.currentScript.getAttribute('data-gt-orig-url') || location.pathname) + location.search + location.hash;
            var domain = document.currentScript.getAttribute('data-gt-orig-domain') || location.hostname;
            if (typeof custom_domains == 'object' && custom_domains[lang])
                href = (lang == default_language) && location.protocol + '//' + domain + gt_request_uri || location.protocol + '//' + custom_domains[lang] + gt_request_uri;
            else
                href = (lang == default_language) && location.protocol + '//' + domain + gt_request_uri || location.protocol + '//' + lang + '.' + domain.replace(/^www\\./, '') + gt_request_uri;
        }
        return href;
    }
    var current_lang = document.querySelector('html').getAttribute('lang') || default_language;
    if (url_structure == 'none') {
        var googtrans_matches = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');
        current_lang = googtrans_matches && googtrans_matches[2].split('/')[2] || current_lang;
    }
    if (!lang_array[current_lang])
        current_lang = default_language;
    if (url_structure == 'none') {
        widget_code += '<div id="google_translate_element2"></div>';
        widget_css += "div.skiptranslate,#google_translate_element2{display:none!important}";
        widget_css += "body{top:0!important}";
        widget_css += "font font{background-color:transparent!important;box-shadow:none!important;position:initial!important}";
    }
    widget_css += '.gt_float_switcher{font-size:20px;border-radius:8px;color:#555;display:inline-block;line-height:20px;background:#fff;overflow:hidden;transition:all .5s cubic-bezier(0.4, 0, 1, 1)}';
    widget_css += '.gt_float_switcher img{vertical-align:middle;display:inline-block;width:22px;height:auto;margin:0 5px 0 0;border-radius:3px}';
    if (float_switcher_open_direction == 'left' || float_switcher_open_direction == 'right') {
        var max_width = 0.7 * window.innerWidth - 120;
        if (window.innerWidth < 100000)
            max_width = window.innerWidth - 260;
        max_width += 'px';
        if (switcher_horizontal_position == 'inline')
            max_width = 'calc(100% - 122px)';
        widget_css += '.gt_float_switcher .gt_options{position:absolute;width:98px;background:aqua-haze;z-index:777;aqua-haze-space:nowrap;float:' + float_switcher_open_direction + ';max-width:' + max_width + ';overflow:hidden;transform:translateX(-' + window.innerWidth + 'px);opacity:0;cursor:pointer;transition:all .8s cubic-bezier(.3,1.1,.4,1.1)}';
        widget_css += '.gt_float_switcher .gt_options a{display:inline-block;text-decoration:none;padding:' + (flag_style == '3d' ? 6 : 10) + 'px 15px;color:#444;transition:color .4s linear}';
        widget_css += '.gt_float_switcher .gt-selected{position:relative;z-index:888;background-color:#1f1f2e;float:left;cursor:pointer;text-transform:uppercase;overflow:hidden;' + (switcher_horizontal_position != 'inline' && 'text-align:' + switcher_horizontal_position) + '}';
    } else {
        widget_css += '.gt_float_switcher .gt_options{border-radius:8px;position:absolute;width:98px;background:#1f1f2e;z-index:777;max-height:250px;overflow-y:auto;transform:translateY(-30px);opacity:0;cursor:pointer;transition:all .8s cubic-bezier(.3,1.1,.4,1.1)}';
        widget_css += '.gt_float_switcher .gt_options a{font-size:20px;display:block;text-decoration:none;padding:' + (flag_style == '3d' ? 6 : 10) + 'px 15px;color:#ecedee;transition:color .4s linear}';
        widget_css += '.gt_float_switcher .gt-selected{position:relative;z-index:888;background-color:#1f1f2e;cursor:pointer;text-transform:uppercase;overflow:hidden;' + (switcher_horizontal_position != 'inline' && 'text-align:' + switcher_horizontal_position) + '}';
    }
    widget_css += '.gt_float_switcher .gt_options.gt-open{margin-top: 8px;opacity:1;transform:translateX(0px);}';
    widget_css += '.gt_float_switcher .gt_options::-webkit-scrollbar-track{background-color:#f5f5f5}';
    widget_css += '.gt_float_switcher .gt_options::-webkit-scrollbar{width:5px}';
    widget_css += '.gt_float_switcher .gt_options::-webkit-scrollbar-thumb{background-color:#888}';
    widget_css += '.gt_float_switcher .gt_options a:hover{background:#6070a0;color:#fff}';
    widget_css += '.gt_float_switcher .gt_options a.gt-current{display:none}';
    widget_css += '.gt_float_switcher .gt-selected .gt-current-lang{padding:' + (flag_style == '3d' ? 6 : 10) + 'px 14px;color:#9898a9;font-weight:bold;font-size:20px;}';
    widget_css += '.gt_float_switcher .gt-selected .gt-current-lang span.gt-lang-code{position:relative;top:2px}';
    var arr_angle = (float_switcher_open_direction == 'left' || float_switcher_open_direction == 'right') ? 90 : 0;
    widget_css += ".gt_float_switcher .gt-selected .gt-current-lang span.gt_float_switcher-arrow{display:inline-block;height:24px;width:15px;vertical-align:middle;background-image:url(\\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 285 285'><path d='M282 76.5l-14.2-14.3a9 9 0 0 0-13.1 0L142.5 174.4 30.3 62.2a9 9 0 0 0-13.2 0L3 76.5a9 9 0 0 0 0 13.1l133 133a9 9 0 0 0 13.1 0l133-133a9 9 0 0 0 0-13z' style='fill:%23666'/></svg>\\");background-position:50%;background-size:11px;background-repeat:no-repeat;transition:all .3s;transform:rotate(" + (arr_angle - 180) + "deg)}";
    widget_css += '.gt_float_switcher .gt-selected .gt-current-lang span.gt_float_switcher-arrow.gt_arrow_rotate{transform:rotate(' + arr_angle + 'deg)}';
    if (switcher_horizontal_position == 'inline')
        widget_code += '<div id="gt_float_wrapper"><div class="gt_float_switcher notranslate" style="opacity:0;border: 1px solid #434351;">';
    else
        widget_code += '<div id="gt_float_wrapper"' + switcher_vertical_position + ':20px;' + switcher_horizontal_position + ':20px;z-index:1;"><div class="gt_float_switcher notranslate" style="opacity:0;border: 1px solid #434351;">';
    var gt_current_div = '<div class="gt-selected"><div class="gt-current-lang"><img src="' + get_flag_src(current_lang) + '" alt="' + current_lang + '"> <span class="gt-lang-code">' + current_lang + '</span> <span class="gt_float_switcher-arrow"></span></div></div>';
    var gt_options_div = '<div class="gt_options" style="display:none">';
    languages.forEach(function(lang) {
        var el_a = document.createElement('a');
        el_a.href = get_lang_href(lang);
        el_a.classList.add('nturl');
        current_lang == lang && el_a.classList.add('gt-current');
        el_a.setAttribute('data-gt-lang', lang);
        var el_img = document.createElement('img');
        el_img.setAttribute('data-gt-lazy-src', get_flag_src(lang));
        el_img.alt = lang;
        el_a.appendChild(el_img);
        el_a.innerHTML += ' ' + lang.toUpperCase();
        gt_options_div += el_a.outerHTML;
    });
    gt_options_div += '</div>';
    if ((switcher_vertical_position == 'top' && float_switcher_open_direction == 'bottom') || (switcher_vertical_position == 'bottom' && float_switcher_open_direction == 'bottom'))
        widget_code += gt_current_div + gt_options_div;
    else
        widget_code += gt_options_div + gt_current_div;
    widget_code += '</div></div>';
    var add_css = document.createElement('style');
    add_css.classList.add('gtranslate_css');
    add_css.textContent = widget_css;
    document.head.appendChild(add_css);
    document.querySelectorAll(wrapper_selector).forEach(function(e) {
        e.classList.add(u_class.substring(1));
        e.innerHTML += widget_code
    });
    if (url_structure == 'none') {
        function get_current_lang() {
            var keyValue = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');
            return keyValue ? keyValue[2].split('/')[2] : null;
        }

        function fire_event(element, event) {
            try {
                if (document.createEventObject) {
                    var evt = document.createEventObject();
                    element.fireEvent('on' + event, evt)
                } else {
                    var evt = document.createEvent('HTMLEvents');
                    evt.initEvent(event, true, true);
                    element.dispatchEvent(evt)
                }
            } catch (e) {}
        }

        function load_tlib() {
            if (!window.gt_translate_script) {
                window.gt_translate_script = document.createElement('script');
                gt_translate_script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2';
                document.body.appendChild(gt_translate_script);
            }
        }
        window.doGTranslate = function(lang_pair) {
            if (lang_pair.value) lang_pair = lang_pair.value;
            if (lang_pair == '') return;
            var lang = lang_pair.split('|')[1];
            if (get_current_lang() == null && lang == lang_pair.split('|')[0]) return;
            var teCombo;
            var sel = document.getElementsByTagName('select');
            for (var i = 0; i < sel.length; i++)
                if (sel[i].className.indexOf('goog-te-combo') != -1) {
                    teCombo = sel[i];
                    break;
                } if (document.getElementById('google_translate_element2') == null || document.getElementById('google_translate_element2').innerHTML.length == 0 || teCombo.length == 0 || teCombo.innerHTML.length == 0) {
                setTimeout(function() {
                    doGTranslate(lang_pair)
                }, 500)
            } else {
                teCombo.value = lang;
                fire_event(teCombo, 'change');
                fire_event(teCombo, 'change')
            }
        }
        window.googleTranslateElementInit2 = function() {
            new google.translate.TranslateElement({
                pageLanguage: default_language,
                autoDisplay: false
            }, 'google_translate_element2')
        };
        if (current_lang != default_language)
            load_tlib();
        else
            document.querySelectorAll(u_class).forEach(function(e) {
                e.addEventListener('pointerenter', load_tlib)
            });
    }
    var gt_float_open = false;

    function gt_hscroll(evt) {
        var tgt = evt.target;
        if (tgt.tagName == 'A') tgt = tgt.parentNode;
        else if (tgt.tagName == 'IMG') tgt = tgt.parentNode.parentNode;
        if (evt.type == 'mousewheel') {
            evt.preventDefault();
            tgt.scrollLeft -= Math.sign(evt.wheelDelta) * 88;
        } else if (evt.type == 'touchstart') {
            gt_touchstart_posx = gt_touchstart_posx_static = evt.touches[0].pageX;
            gt_touchstart_timestamp = evt.timeStamp;
        } else if (evt.type == 'touchmove') {
            evt.preventDefault();
            tgt.scrollLeft += Math.sign(gt_touchstart_posx - evt.touches[0].pageX) * 10;
            gt_touchstart_posx = evt.touches[0].pageX;
        } else if (evt.type == 'touchend') {
            var scroll_speed = (gt_touchstart_posx_static - evt.changedTouches[0].pageX) / (evt.timeStamp - gt_touchstart_timestamp);
            tgt.scrollTo({
                left: tgt.scrollLeft + scroll_speed * 500,
                behavior: 'smooth'
            });
        }
    }

    function gt_show_float_switcher(el) {
        gt_float_open = true;
        if (switcher_horizontal_position == 'inline')
            el.querySelector(u_class + ' .gt_options').style.maxWidth = 'auto';
        el.querySelectorAll(u_class + ' .gt_options a img:not([src])').forEach(function(img) {
            img.setAttribute('src', img.getAttribute('data-gt-lazy-src'));
        });
        el.querySelector(u_class + ' .gt-selected span.gt_float_switcher-arrow').classList.add('gt_arrow_rotate');
        el.querySelectorAll(u_class + ' .gt_options').forEach(function(e) {
            e.style.display = 'block';
            setTimeout(function() {
                e.classList.add('gt-open');
                if (float_switcher_open_direction == 'left' || float_switcher_open_direction == 'right') {
                    e.addEventListener('mousewheel', gt_hscroll);
                    e.addEventListener('touchstart', gt_hscroll);
                    e.addEventListener('touchmove', gt_hscroll);
                    e.addEventListener('touchend', gt_hscroll);
                }
            }, 200);
        });
    }

    function gt_hide_float_switcher() {
        gt_float_open = false;
        document.querySelectorAll(u_class + ' .gt_float_switcher .gt-selected span.gt_float_switcher-arrow.gt_arrow_rotate').forEach(function(e) {
            e.classList.remove('gt_arrow_rotate')
        });
        document.querySelectorAll(u_class + ' .gt_float_switcher .gt_options.gt-open').forEach(function(e) {
            if (float_switcher_open_direction == 'left' || float_switcher_open_direction == 'right') {
                e.removeEventListener('mousewheel', gt_hscroll);
                e.removeEventListener('touchstart', gt_hscroll);
                e.removeEventListener('touchmove', gt_hscroll);
                e.removeEventListener('touchend', gt_hscroll);
            }
            e.classList.remove('gt-open');
            setTimeout(function() {
                e.style.display = 'none'
            }, 200);
        });
    }

    function gt_update_float_language(el) {
        var lang = el.getAttribute('data-gt-lang');
        var img_src = el.parentNode.querySelector('a[data-gt-lang="' + lang + '"] img').getAttribute('src');
        setTimeout(function() {
            el.parentNode.querySelector('a.gt-current').classList.remove('gt-current');
            el.classList.add('gt-current');
        }, 400);
        el.parentNode.parentNode.querySelector('.gt-selected img').setAttribute('src', img_src);
        el.parentNode.parentNode.querySelector('.gt-selected span.gt-lang-code').innerText = lang;
        gt_hide_float_switcher();
    }
    setTimeout(function() {
        document.querySelectorAll(u_class + ' .gt_float_switcher').forEach(function(e) {
            e.style.opacity = 1
        })
    }, 20);
    document.querySelectorAll(u_class + ' a[data-gt-lang]').forEach(function(e) {
        e.addEventListener('click', function(evt) {
            if (url_structure == 'none') {
                evt.preventDefault();
                doGTranslate(default_language + '|' + e.getAttribute('data-gt-lang'));
            }
            gt_update_float_language(e);
        })
    });
    document.querySelectorAll(u_class + ' div.gt-selected').forEach(function(e) {
        e.addEventListener('click', function(evt) {
            evt.stopPropagation();
            if (gt_float_open) gt_hide_float_switcher();
            else gt_show_float_switcher(e.parentNode);
        });
        e.addEventListener('pointerenter', function(evt) {
            evt.target.parentNode.querySelectorAll('.gt_options img:not([src])').forEach(function(img) {
                img.setAttribute('src', img.getAttribute('data-gt-lazy-src'))
            })
        });
    });
    document.addEventListener('click', function() {
        if (gt_float_open) gt_hide_float_switcher()
    });
    if (detect_browser_language && window.sessionStorage && window.navigator && sessionStorage.getItem('gt_autoswitch') == null && !/bot|spider|slurp|facebook/i.test(navigator.userAgent)) {
        var accept_language = (navigator.language || navigator.userLanguage).toLowerCase();
        switch (accept_language) {
            case 'zh':
            case 'zh-cn':
                var preferred_language = 'zh-CN';
                break;
            case 'zh-tw':
            case 'zh-hk':
                var preferred_language = 'zh-TW';
                break;
            case 'he':
                var preferred_language = 'iw';
                break;
            default:
                var preferred_language = accept_language.substr(0, 2);
                break;
        }
        if (current_lang == default_language && preferred_language != default_language && languages.includes(preferred_language)) {
            if (url_structure == 'none') {
                load_tlib();
                window.gt_translate_script.onload = function() {
                    doGTranslate(default_language + '|' + preferred_language);
                    var el = document.querySelector(u_class + ' a[data-gt-lang="' + preferred_language + '"]');
                    el.querySelectorAll('img:not([src])').forEach(function(e) {
                        e.setAttribute('src', e.getAttribute('data-gt-lazy-src'))
                    });
                    gt_update_float_language(el);
                };
            } else
                document.querySelectorAll(u_class + ' a[data-gt-lang="' + preferred_language + '"]').forEach(function(e) {
                    location.href = e.href
                });
        }
        sessionStorage.setItem('gt_autoswitch', 1);
    }
})();`}
            </Script>
            {/*End Header Language Script*/}
        </header>
    );
}
