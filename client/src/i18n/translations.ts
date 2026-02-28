export const translations = {
    EN: {
        common: {
            loading: "Loading...",
            save: "Save",
            cancel: "Cancel",
            delete: "Delete",
            edit: "Edit",
            user: "User",
            email: "Email Address",
            next: "Next",
            previous: "Previous",
            back: "Back",
            finish: "Finish",
            success: "Success",
            error: "Error",
            login: "Login",
            logout: "Log out",
            help: "Help",
            online: "Online",
            thinking: "Thinking...",
            sendMessage: "Send message",
            logoutSuccess: "Logged out",
            logoutError: "Logout failed"
        },
        sidebar: {
            dashboard: "Dashboard",
            checkin: "Daily Check-in",
            analytics: "Analytics",
            newChat: "New Chat",
            recentChats: "Recent Chats",
            noHistory: "No history yet",
            collapse: "Collapse Sidebar",
            close: "Close Sidebar",
            deleteChatTitle: "Delete Chat",
            deleteChatConfirm: "Are you sure you want to delete this chat? This action cannot be undone.",
            deleteLabel: "Delete",
            untitledChat: "Untitled Chat",
            menu: "Menu"
        },
        navbar: {
            openSidebar: "Open sidebar",
            help: "Help",
            bantuan: "Help",
            feedback: "Feedback"
        },
        profileMenu: {
            myProfile: "My Profile",
            settings: "Settings",
            about: "About",
            contact: "Contact Us",
            help: "Help",
            logout: "Log out",
            helpSoon: "Help center coming soon!"
        },
        contact: {
            title: "Contact Us",
            subtitle: "Have questions? We'd love to hear from you.",
            name: "Full Name",
            email: "Email Address",
            subject: "Subject",
            message: "Your Message",
            send: "Send Message",
            sending: "Sending...",
            success: "Message sent! We'll get back to you soon.",
            error: "Failed to send message. Please try again.",
            responseNotice: "Our team typically responds within 24-48 business hours.",
            ctaNotice: "Need immediate support? Try our daily check-in or chat with MenTex AI.",
            directEmail: "Direct Support",
            formTitle: "Send us a message",
            uploadScreenshot: "Attach Screenshot",
            screenshotSubtitle: "Upload a JPG/PNG of the issue (optional)",
            screenshotSelected: "Screenshot selected",
            remove: "Remove",
            subjects: {
                report: "Report a Problem",
                feedback: "Send Feedback",
                improvement: "Ask for Improvement",
                others: "Others",
                custom: "Custom Subject"
            }
        },
        feedback: {
            title: "Feedback",
            subtitle: "We value your thoughts on how we can improve MenTex.",
            formTitle: "Share Your Feedback",
            placeholder: "Tell us what you think...",
            success: "Thank you for your Feedback! We will see and improve MenTex based on your thoughts.",
            error: "Failed to send feedback. Please try again."
        },
        landing: {
            heroTitle: "Your Mental Wellness, Supported by AI.",
            heroSubtitle: "A safe space to check-in with yourself, track your moods, and get AI-powered insights for a better mind.",
            getStarted: "Get Started",
            login: "Login",
            footer: "MenTex - Mental Health Companion",
            sub: "Your safe space to talk.",
            welcomeBack: (name: string) => `Welcome back, ${name}.`,
            btnStart: "Login to Start",
            btnDashboard: "Go to Dashboard",
            morning: "Good Morning",
            afternoon: "Good Afternoon",
            evening: "Good Evening",
            night: "Good Night"
        },
        dashboard: {
            title: "Dashboard",
            welcome: "Welcome back",
            overview: "Here's your wellness overview for today.",
            todayMood: "Today's Mood",
            recorded: (count: number) => `Recorded ${count} times today`,
            firstCheckin: "First check-in of the day",
            updateMood: "Update Mood",
            logMood: "Log Your Mood",
            noMood: "No mood recorded yet today.",
            noCheckin: "You haven't checked in today.",
            checkInNow: "Check-in Now",
            weeklyTrend: "Weekly Trend",
            last7Days: "Last 7 days",
            aiInsight: "AI Wellness Insight",
            moodHistory: "Mood History",
            history: "History",
            calendar: "Calendar",
            seeAll: "See All",
            initialChat: (name: string, mood: string) => `Hi ${name}, I noticed you're feeling ${mood} today. Want to talk about it?`,
            placeholderChat: "Message MenTex...",
            listView: "List View",
            calendarView: "Calendar View",
            loading: "Loading...",
            noMoods: "No moods recorded yet.",
            noMoodsToday: "No moods yet today.",
            chatTitle: (mood?: string) => mood
                ? `I noticed you're feeling ${mood.toLowerCase()} today.`
                : "How are you feeling right now?",
            chatSub: (mood?: string) => mood
                ? "Do you want to talk about what's on your mind? I'm here to listen."
                : "I'm here to listen and support you without judgment.",
            chatPlaceholder: "Type a message to start chatting...",
            timeline: "Today's Timeline",
            viewReport: "View Full Report",
            chartEmpty: "Start checking in today to see your daily mood line.",
            noNoteShort: "No note added.",
            savedReason: "Saved reason",
            noNote: "No note added for this check-in.",
            addNotePlaceholder: "Add your note here...",
            noteUpdated: "Note updated successfully",
            noteUpdateError: "Failed to update note",
            entryDeleted: "Entry deleted successfully",
            entryDeleteError: "Failed to delete entry",
            deleteConfirm: "Are you sure you want to delete this entry?",
            moods: {
                5: "Great",
                4: "Okay",
                3: "Tired",
                2: "Anxious",
                1: "Sad"
            }
        },
        profile: {
            title: "Profile",
            accountDetails: "Account Details",
            memberSince: "Member Since",
            security: "Security",
            changePass: "Change Password",
            newPass: "New Password",
            confirmPass: "Confirm New Password",
            updatePass: "Update Password",
            nameUpdated: "Name updated successfully",
            nameUpdateError: "Failed to update name",
            passUpdated: "Password updated successfully",
            passMatchError: "Passwords do not match",
            passLengthError: "Password must be at least 6 characters",
            updatingPass: "Updating password...",
            reauthRequired: "For security, please log out and log in again to change your password.",
            placeholderPass: "Enter new password",
            placeholderConfirm: "Confirm new password",
            personalizedDetails: "Personalized Details",
            gender: "Gender",
            dob: "Date of Birth",
            updateProfile: "Update Profile",
            profileUpdated: "Profile updated successfully",
            profileUpdateError: "Failed to update profile",
            selectGender: "Select Gender",
            editName: "Edit Name",
            placeholderName: "Enter your name"
        },
        about: {
            title: "About MenTex",
            headline: "Democratizing Mental Wellness for Every Generation",
            subtitle: "MenTex aligns with UN SDG Goal 3 by making mental wellness support early, private, and accessible.",
            badges: {
                sdg: "SDG Goal 3",
                private: "Private & Encrypted",
                ai: "AI + Human Backed"
            },
            mission: {
                title: "Our Mission",
                purpose: {
                    title: "Clear Purpose",
                    body: "Help people detect emotional patterns early before they become crises."
                },
                access: {
                    title: "Accessibility for All",
                    body: "Built for every age group with a simple, compassionate experience."
                },
                cost: {
                    title: "Affordable Care",
                    body: "Lower the cost barriers that block people from getting regular support."
                }
            },
            flow: {
                title: "AI-Driven. Human-Backed.",
                step1: {
                    title: "Daily Check-ins",
                    desc: "Log your mood and thoughts in seconds. Our AI listens without judgment, 24 hours a day."
                },
                step2: {
                    title: "Smart Analytics",
                    desc: "MenTex detects patterns in your emotions over time and generates a clear weekly wellness report automatically."
                },
                step3: {
                    title: "Therapist Ready",
                    desc: "Share your report directly with your therapist before your session. Turn check-ins into data your doctor can use."
                }
            },
            sdg: {
                title: "Our Commitment to SDG Goal 3",
                allAges: { title: "All-Age Design", desc: "Simple UI accessible for students to seniors." },
                proactive: { title: "Proactive Intervention", desc: "Spot patterns before they become crises." },
                cost: { title: "Cost Reduction", desc: "Lower the financial barrier to mental support." },
                therapist: { title: "Therapist Integration", desc: "Make real-world therapy more efficient." },
                availability: { title: "24/7 Availability", desc: "Support that never sleeps or judges." },
                privacy: { title: "Private & Encrypted", desc: "Your data belongs only to you." }
            },
            features: {
                title: "What MenTex Delivers",
                ai: {
                    title: "AI Conversations",
                    desc: "Empathetic, real-time dialogue available 24/7. Our AI understands context and responds with care."
                },
                analytics: {
                    title: "Mood Analytics",
                    desc: "Visualize your emotional journey over days and weeks. Understand the why behind how you feel."
                },
                secure: {
                    title: "Secure Check-ins",
                    desc: "End-to-end encryption keeps your journal completely private. Nobody sees your data without your permission."
                },
                resources: {
                    title: "Professional Resources",
                    desc: "Direct access to global helplines, therapist directories, and one-click report sharing with your doctor."
                }
            },
            cta: {
                title: "Start Your Wellness Journey Today",
                checkin: "Start Daily Check-in",
                how: "See How It Works"
            }
        },
        login: {
            welcome: "Welcome Back",
            createAccount: "Create Account",
            step: (current: number) => `Step ${current} of 3`,
            signinContinue: "Sign in to continue",
            email: "Email",
            password: "Password",
            forgotPass: "Forgot Password?",
            signingIn: "Signing In...",
            signIn: "Sign In",
            forgotPassDesc: "Enter your email address and we'll send you a link to reset your password.",
            sendResetLink: "Send Reset Link",
            sending: "Sending...",
            nextProfile: "Next: Profile",
            nextDetails: "Next: Details",
            fullName: "Full Name",
            dob: "Date of Birth",
            gender: "Gender",
            selectGender: "Select Gender",
            male: "Male",
            female: "Female",
            nonBinary: "Non-binary",
            preferNotToSay: "Prefer not to say",
            creating: "Creating...",
            or: "OR",
            google: "Continue with Google",
            noAccount: "Don't have an account? ",
            hasAccount: "Already have an account? ",
            signUp: "Sign Up",
            verifyTitle: "Verify Your Email",
            verifySent: (email: string) => `We sent a link to ${email}.`,
            verifyCheck: "Please check your inbox to activate your account.",
            resend: "Resend Email",
            goToLogin: "Go to Login",
            emailRequired: "Please enter email and password",
            passLength: "Password must be at least 6 characters",
            nameRequired: "Please enter your full name",
            completeFields: "Please complete all fields",
            verifyFirst: "Please verify your email first",
            welcomeMsg: "Welcome back!",
            googleFailed: "Google Sign In Failed",
            emailSent: "Email sent! Check inbox.",
            resendFailed: "Failed to resend. Try logging in again.",
            resetSent: "Password reset link sent! Check your inbox.",
            resetFailed: "Failed to send reset link. Make sure the email is correct.",
            accountCreated: "Account created! Please verify email.",
            completeProfileNotice: "Welcome! Please finish setting up your profile below."
        },
        settings: {
            title: "Settings",
            preferences: "Application Settings",
            language: "App Language",
            langUpdateError: "Failed to update language",
            langUpdated: "Language updated to English",
            desc: "Personalize your application experience.",
            currentLang: "Current: English",
            changeLang: "Switch to Bahasa Melayu"
        },
        chat: {
            title: "Chat",
            initial: "Hi there. I'm listening. How can I support you today?",
            placeholder: "Message MenTex...",
            savedAccount: "Conversations are saved to your account.",
            savedDevice: "Conversations are saved to this device.",
            error: "Sorry, I'm having trouble connecting right now."
        },
        checkin: {
            title: "Daily Check-in",
            step1Title: "How are you feeling?",
            step1Sub: "Select the mood that best represents right now.",
            step2Title: "What's affecting you?",
            step2Sub: "Select all that apply (optional).",
            step3Title: "Anything else?",
            step3Sub: "Add a short note to record your thoughts.",
            placeholderNote: "I'm feeling this way because...",
            complete: "Complete Check-in",
            great: "Great",
            okay: "Okay",
            tired: "Tired",
            anxious: "Anxious",
            sad: "Sad",
            work: "Work",
            family: "Family",
            relationship: "Relationships",
            social: "Social",
            health: "Health",
            sleep: "Sleep",
            stress: "Stress",
            other: "Other",
            saveError: "Failed to save mood. Please try again.",
            successTitle: "Mood Logged! 🎉",
            successSubtitle: "You can log another mood whenever your feelings change.",
            logAnother: "Log Another",
            logMoodButton: "Log Mood"
        },
        analytics: {
            title: "Analytics",
            heroTitle: "Weekly Wellness Report",
            avgMood: "Average Mood",
            entriesAnalyzed: "Entries Analyzed",
            trend: "Trend",
            volatility: "Volatility",
            bestHour: "Best Hour",
            toughestHour: "Toughest Hour",
            riskBanner: "We noticed difficult emotional signals this week. If you feel overwhelmed, please reach out to a trusted person or professional support.",
            moodTrend: "Mood Trend",
            weekly: "Weekly",
            monthly: "Monthly",
            regen: "Regenerate Analysis",
            regenerating: "Regenerating...",
            loading: "Loading Insights...",
            emptyTitle: "Your Personal Insights Await",
            emptyText: "Log at least 3 mood entries to unlock AI pattern recognition, trigger analysis, and personalized recommendations.",
            emptyProgress: "Entries this week: {count} / 3 needed",
            genFirst: "Generate First Report",
            analyzing: "Analyzing your week...",
            summary: "Weekly Summary",
            patterns: "Patterns Observed",
            highlights: "Positive Highlights",
            recommendations: "Recommended Actions",
            triggers: "Identified Triggers",
            reason: "The Reason",
            observation: "Our Observation",
            impactNotes: "Impact Notes",
            impact: "Impact",
            showAll: "Show All Triggers ({count})",
            showTop2: "Show Top 2 Triggers",
            stable: "Stable",
            improving: "Improving",
            declining: "Declining",
            lastGenerated: "Last generated: ",
            aiGenerated: "AI Generated (Gemini)",
            safeAnalysis: "Safe Local Analysis",
            safetyCheck: "Safety Check: ",
            approved: "APPROVED",
            easy: "Easy",
            medium: "Medium",
            difficult: "Difficult",
            moodStatus: {
                great: "You're trending upward and doing great.",
                stable: "You're holding steady this week.",
                declining: "You're still okay, but mood dropped recently.",
                mixedImproving: "This week was mixed, but improving.",
                mixedReset: "This week was mixed. Slow down and reset.",
                heavy: "This week felt heavy. Please prioritize support."
            }
        },
        journal: {
            title: "My Journal",
            subtitle: "A safe space for your thoughts and emotions.",
            newPage: "New Page",
            selectCategory: "Select Category",
            categories: {
                personal: "Personal",
                work: "Work",
                health: "Health",
                reflection: "Reflection",
                family: "Family",
                other: "Other"
            },
            titlePlaceholder: "Title of your entry...",
            contentPlaceholder: "Express what's on your mind...",
            saveOnly: "Save Only",
            saveTalkAi: "Save & Talk to AI",
            emptyTitle: "Begin the Journey",
            emptyText: "This page is waiting for your words. Write something small today.",
            writeNow: "Write Now",
            aiAdvice: "AI Advice",
            aiReflectionPrompt: (title: string, category: string, content: string) => `I just wrote a journal entry titled "${title}" in the ${category} category. Here's what I wrote: "${content}". Can you provide some therapeutic reflections or advice based on this?`,
            aiReflectionPromptShort: (title: string, content: string) => `I'm reflecting on my journal entry titled "${title}": "${content}". What advice can you give me based on this?`,
            toast: {
                loadFailed: "Failed to load journals",
                fieldsRequired: "Please enter title and content",
                updated: "Journal updated",
                saved: "Journal saved",
                deleteConfirm: "Are you sure you want to delete this journal?",
                deleted: "Journal deleted",
                deleteFailed: "Failed to delete journal",
                saveFailed: "Failed to save journal"
            }
        },
        therapist: {
            title: "My Therapist",
            heading: "Therapist Information",
            subtitle: "Save your therapist details to unlock weekly report sharing.",
            emptyState: "You haven't added your therapist yet.",
            emptyAction: "Add their info to unlock the Send Report feature.",
            addTherapist: "Add Therapist",
            labels: {
                name: "Therapist full name",
                email: "Therapist email address",
                phone: "Therapist phone number",
                clinic: "Clinic / practice name (optional)",
                schedule: "Session day & time",
                nextSession: "Next session date",
                notes: "Private notes about your therapist"
            },
            actions: {
                save: "Save",
                saving: "Saving...",
                delete: "Delete",
                edit: "Edit",
                cancel: "Cancel"
            },
            toast: {
                required: "Therapist full name and email are required.",
                saved: "Therapist information saved.",
                saveFailed: "Failed to save therapist info.",
                deleted: "Therapist information deleted.",
                deleteFailed: "Failed to delete therapist info.",
                deleteConfirm: "Delete therapist information?"
            },
            notProvided: "Not provided"
        },
        helpPage: {
            title: "Help & Support",
            crisis: {
                title: "Immediate Help (Malaysia)",
                subtitle: "If you are in danger now, call emergency services immediately.",
                call: "Call",
                website: "website"
            },
            faqTitle: "Frequently Asked Questions",
            faqs: [
                {
                    q: "How do I add my therapist's information?",
                    a: "Open My Therapist from the profile menu, tap Edit, fill in details, then Save."
                },
                {
                    q: "How do I send my weekly report to my therapist?",
                    a: "Go to Analytics, review the brief, tap Send to Therapist, and confirm Send Report."
                },
                {
                    q: "Is my data private and secure?",
                    a: "Your data is private to your account. Sharing only happens when you explicitly approve it."
                },
                {
                    q: "How does the mood tracker work?",
                    a: "Daily check-ins build your mood history and weekly analytics insights."
                },
                {
                    q: "What does the risk level mean?",
                    a: "Risk level reflects emotional strain based on mood trend, volatility, and report signals."
                },
                {
                    q: "How do I delete my account or data?",
                    a: "Email support@mentex.app from your registered email and request deletion."
                },
                {
                    q: "Can my therapist see my journal entries?",
                    a: "No. Therapists only see the brief that you preview and approve before sending."
                },
                {
                    q: "What do I do if I feel the AI insight is wrong?",
                    a: "Use Send Feedback and rely on professional advice where needed."
                }
            ]
        }
    },
    BM: {
        common: {
            loading: "Memuatkan...",
            save: "Simpan",
            cancel: "Batal",
            delete: "Padam",
            edit: "Kemaskini",
            user: "Pengguna",
            email: "Alamat Emel",
            next: "Seterusnya",
            previous: "Kembali",
            back: "Kembali",
            finish: "Selesai",
            success: "Berjaya",
            error: "Ralat",
            login: "Log Masuk",
            logout: "Log Keluar",
            help: "Bantuan",
            online: "Dalam Talian",
            thinking: "Berfikir...",
            sendMessage: "Hantar mesej",
            logoutSuccess: "Telah log keluar",
            logoutError: "Log keluar gagal"
        },
        sidebar: {
            dashboard: "Papan Pemuka",
            checkin: "Daftar Masuk",
            analytics: "Analitik",
            newChat: "Sembang Baru",
            recentChats: "Sembang Terkini",
            noHistory: "Tiada sejarah lagi",
            collapse: "Tutup Sisi",
            close: "Tutup Sisi",
            deleteChatTitle: "Padam Sembang",
            deleteChatConfirm: "Adakah anda pasti mahu memadamkan sembang ini? Tindakan ini tidak dapat dibatalkan.",
            deleteLabel: "Padam",
            untitledChat: "Sembang Tanpa Tajuk",
            menu: "Menu"
        },
        navbar: {
            openSidebar: "Buka sisi",
            help: "Bantuan",
            bantuan: "Bantuan",
            feedback: "Maklum Balas"
        },
        profileMenu: {
            myProfile: "Profil Saya",
            settings: "Tetapan",
            about: "Mengenai",
            contact: "Hubungi Kami",
            help: "Bantuan",
            logout: "Log Keluar",
            helpSoon: "Pusat bantuan akan datang!"
        },
        feedback: {
            title: "Maklum Balas",
            subtitle: "Kami menghargai pendapat anda tentang cara kami boleh menambah baik MenTex.",
            formTitle: "Kongsi Maklum Balas Anda",
            placeholder: "Beritahu kami apa yang anda fikirkan...",
            success: "Terima kasih atas Maklum Balas anda! Kami akan melihat dan menambah baik MenTex berdasarkan pendapat anda.",
            error: "Gagal menghantar maklum balas. Sila cuba lagi."
        },
        contact: {
            title: "Hubungi Kami",
            subtitle: "Ada soalan? Kami sedia mendengar daripada anda.",
            name: "Nama Penuh",
            email: "Alamat Emel",
            subject: "Subjek",
            message: "Mesej Anda",
            send: "Hantar Mesej",
            sending: "Menghantar...",
            success: "Mesej dihantar! Kami akan menghubungi anda segera.",
            error: "Gagal menghantar mesej. Sila cuba lagi.",
            responseNotice: "Pasukan kami biasanya memberi maklum balas dalam masa 24-48 jam waktu bekerja.",
            ctaNotice: "Perlukan sokongan segera? Cuba daftar masuk harian atau berbual dengan MenTex AI.",
            directEmail: "Sokongan Terus",
            formTitle: "Hantarkan mesej kepada kami",
            uploadScreenshot: "Lampirkan Tangkapan Skrin",
            screenshotSubtitle: "Muat naik JPG/PNG masalah (pilihan)",
            screenshotSelected: "Tangkapan skrin dipilih",
            remove: "Padam",
            subjects: {
                report: "Laporkan Masalah",
                feedback: "Hantar Maklum Balas",
                improvement: "Cadangkan Penambahbaikan",
                others: "Lain-lain",
                custom: "Subjek Sendiri"
            }
        },
        landing: {
            heroTitle: "Kesejahteraan Mental Anda, Disokong oleh AI.",
            heroSubtitle: "Ruang selamat untuk menyemak diri anda, menjejaki mood anda, dan mendapatkan pandangan dikuasakan AI untuk minda yang lebih baik.",
            getStarted: "Bermula",
            login: "Log Masuk",
            footer: "MenTex - Teman Kesihatan Mental",
            sub: "Ruang selamat anda untuk bercerita.",
            welcomeBack: (name: string) => `Selamat kembali, ${name}.`,
            btnStart: "Daftar Masuk",
            btnDashboard: "Pergi ke Papan Pemuka",
            morning: "Selamat Pagi",
            afternoon: "Selamat Tengahari",
            evening: "Selamat Petang",
            night: "Selamat Malam"
        },
        dashboard: {
            title: "Papan Pemuka",
            welcome: "Selamat kembali",
            overview: "Berikut adalah ringkasan kesejahteraan anda hari ini.",
            todayMood: "Mood Hari Ini",
            recorded: (count: number) => `Direkodkan ${count} kali hari ini`,
            firstCheckin: "Daftar masuk pertama hari ini",
            updateMood: "Kemaskini Mood",
            logMood: "Rekod Mood Anda",
            noMood: "Tiada mood direkodkan lagi hari ini.",
            noCheckin: "Anda belum mendaftar masuk hari ini.",
            checkInNow: "Daftar Masuk Sekarang",
            weeklyTrend: "Trend Mingguan",
            last7Days: "7 hari terakhir",
            aiInsight: "Pandangan Wellness AI",
            moodHistory: "Sejarah Mood",
            history: "Sejarah",
            calendar: "Kalendar",
            seeAll: "Lihat Semua",
            initialChat: (name: string, mood: string) => `Hai ${name}, saya perasan anda rasa ${mood} hari ini. Mahu berbincang tentangnya?`,
            placeholderChat: "Mesej MenTex...",
            listView: "Paparan Senarai",
            calendarView: "Paparan Kalendar",
            loading: "Memuatkan sejarah...",
            noMoods: "Tiada mood direkodkan dalam tempoh ini.",
            noMoodsToday: "Tiada mood direkodkan hari ini lagi.",
            chatTitle: (mood?: string) => mood
                ? `Saya perasan anda rasa ${mood.toLowerCase()} hari ini.`
                : "Apa khabar anda sekarang?",
            chatSub: (mood?: string) => mood
                ? "Adakah anda ingin berbual tentang apa yang ada dalam fikiran anda? Saya di sini untuk mendengar."
                : "Saya di sini untuk mendengar dan menyokong anda tanpa menghakimi.",
            chatPlaceholder: "Taip mesej untuk mula berbual...",
            timeline: "Garis Masa Hari Ini",
            viewReport: "Lihat Laporan Mingguan",
            chartEmpty: "Mula mendaftar masuk hari ini untuk melihat garis mood harian anda.",
            noNoteShort: "Tiada nota ditambah.",
            savedReason: "Sebab disimpan",
            noNote: "Tiada nota ditambah untuk daftar masuk ini.",
            addNotePlaceholder: "Tambah nota anda di sini...",
            noteUpdated: "Nota berjaya dikemas kini",
            noteUpdateError: "Gagal mengemas kini nota",
            entryDeleted: "Rekod berjaya dipadam",
            entryDeleteError: "Gagal memadam rekod",
            deleteConfirm: "Adakah anda pasti mahu memadamkan rekod ini?",
            moods: {
                5: "Hebat",
                4: "Okay",
                3: "Penat",
                2: "Gelisah",
                1: "Sedih"
            }
        },
        profile: {
            title: "Profil",
            accountDetails: "Butiran Akaun",
            memberSince: "Ahli Sejak",
            security: "Keselamatan",
            changePass: "Tukar Kata Laluan",
            newPass: "Kata Laluan Baru",
            confirmPass: "Sahkan Kata Laluan Baru",
            updatePass: "Kemaskini Kata Laluan",
            nameUpdated: "Nama berjaya dikemaskini",
            nameUpdateError: "Gagal mengemaskini nama",
            passUpdated: "Kata laluan berjaya dikemaskini",
            passMatchError: "Kata laluan tidak sepadan",
            passLengthError: "Kata laluan mestilah sekurang-kurangnya 6 aksara",
            updatingPass: "Mengemaskini kata laluan...",
            reauthRequired: "Untuk keselamatan, sila log keluar dan log masuk semula untuk menukar kata laluan anda.",
            placeholderPass: "Masukkan kata laluan baru",
            placeholderConfirm: "Sahkan kata laluan baru",
            personalizedDetails: "Butiran Peribadi",
            gender: "Jantina",
            dob: "Tarikh Lahir",
            updateProfile: "Kemaskini Profil",
            profileUpdated: "Profil berjaya dikemaskini",
            profileUpdateError: "Gagal mengemaskini profil",
            selectGender: "Pilih Jantina",
            editName: "Kemaskini Nama",
            placeholderName: "Masukkan nama anda"
        },
        about: {
            title: "Mengenai MenTex",
            headline: "Mendemokrasikan Kesejahteraan Mental Untuk Setiap Generasi",
            subtitle: "MenTex menyokong Matlamat SDG PBB 3 dengan menjadikan sokongan kesejahteraan mental lebih awal, peribadi, dan mudah dicapai.",
            badges: {
                sdg: "Matlamat SDG 3",
                private: "Peribadi & Terenkripsi",
                ai: "AI + Sokongan Manusia"
            },
            mission: {
                title: "Misi Kami",
                purpose: {
                    title: "Tujuan Jelas",
                    body: "Membantu orang mengesan corak emosi lebih awal sebelum ianya menjadi krisis."
                },
                access: {
                    title: "Kebolehcapaian untuk Semua",
                    body: "Dibina untuk semua peringkat umur dengan pengalaman yang ringkas dan penuh belas kasihan."
                },
                cost: {
                    title: "Penjagaan Mampu Milik",
                    body: "Menurunkan halangan kos yang menghalang orang ramai daripada mendapat sokongan tetap."
                }
            },
            flow: {
                title: "Dipacu AI. Disokong Manusia.",
                step1: {
                    title: "Daftar Masuk Harian",
                    desc: "Rekod mood dan fikiran anda dalam beberapa saat. AI kami mendengar tanpa menghakimi, 24 jam sehari."
                },
                step2: {
                    title: "Analitik Pintar",
                    desc: "MenTex mengesan corak dalam emosi anda dari semasa ke semasa dan menghasilkan laporan kesejahteraan mingguan yang jelas secara automatik."
                },
                step3: {
                    title: "Sedia untuk Terapi",
                    desc: "Kongsi laporan anda terus dengan ahli terapi anda sebelum sesi anda. Tukar daftar masuk menjadi data yang boleh digunakan oleh doktor anda."
                }
            },
            sdg: {
                title: "Komitmen Kami Terhadap Matlamat SDG 3",
                allAges: { title: "Reka Bentuk Semua Peringkat Umur", desc: "UI ringkas yang boleh diakses untuk pelajar hingga warga emas." },
                proactive: { title: "Intervensi Proaktif", desc: "Kesan corak sebelum ianya menjadi krisis." },
                cost: { title: "Pengurangan Kos", desc: "Menurunkan halangan kewangan untuk sokongan mental." },
                therapist: { title: "Integrasi Ahli Terapi", desc: "Menjajakan terapi dunia sebenar dengan lebih cekap." },
                availability: { title: "Ketersediaan 24/7", desc: "Sokongan yang tidak pernah tidur atau menghakimi." },
                privacy: { title: "Peribadi & Terenkripsi", desc: "Data anda adalah milik anda sahaja." }
            },
            features: {
                title: "Apa yang MenTex Tawarkan",
                ai: {
                    title: "Perbualan AI",
                    desc: "Dialog empati masa nyata tersedia 24/7. AI kami memahami konteks dan bertindak balas dengan prihatin."
                },
                analytics: {
                    title: "Analitik Mood",
                    desc: "Visualisasikan perjalanan emosi anda selama berhari-hari dan berminggu-minggu. Fahami sebab di sebalik perasaan anda."
                },
                secure: {
                    title: "Daftar Masuk Selamat",
                    desc: "Enkripsi hujung-ke-hujung mengekalkan privasi jurnal anda sepenuhnya. Tiada sesiapa melihat data anda tanpa kebenaran anda."
                },
                resources: {
                    title: "Sumber Profesional",
                    desc: "Akses terus ke talian bantuan global, direktori ahli terapi, dan perkongsian laporan satu klik dengan doktor anda."
                }
            },
            cta: {
                title: "Mulakan Perjalanan Wellness Anda Hari Ini",
                checkin: "Mula Daftar Masuk Harian",
                how: "Lihat Bagaimana Ia Berfungsi"
            }
        },
        settings: {
            title: "Tetapan",
            preferences: "Tetapan Aplikasi",
            language: "Bahasa Aplikasi",
            langUpdated: "Bahasa dikemaskini ke Bahasa Melayu",
            langUpdateError: "Gagal mengemaskini bahasa",
            desc: "Peribadikan pengalaman aplikasi anda.",
            currentLang: "Semasa: Bahasa Melayu",
            changeLang: "Tukar ke English"
        },
        chat: {
            title: "Sembang",
            initial: "Hai. Saya sedia mendengar. Apa yang boleh saya bantu hari ini?",
            placeholder: "Mesej MenTex...",
            savedAccount: "Perbualan disimpan ke akaun anda.",
            savedDevice: "Perbualan disimpan ke peranti ini.",
            error: "Maaf, saya mengalami masalah penyambungan sekarang."
        },
        checkin: {
            title: "Daftar Masuk",
            step1Title: "Apa khabar anda hari ini?",
            step1Sub: "Pilih emoji yang sesuai dengan mood anda",
            step2Title: "Apa yang mempengaruhi anda?",
            step2Sub: "Pilih semua yang berkaitan (pilihan).",
            step3Title: "Ada perkara lain?",
            step3Sub: "Tambah nota",
            placeholderNote: "Apa yang anda fikirkan? (Pilihan)",
            complete: "Selesai Daftar Masuk",
            great: "Hebat",
            okay: "Okay",
            tired: "Penat",
            anxious: "Gelisah",
            sad: "Sedih",
            work: "Kerja",
            family: "Keluarga",
            relationship: "Hubungan",
            social: "Sosial",
            health: "Kesihatan",
            sleep: "Tidur",
            stress: "Tekanan",
            other: "Lain-lain",
            saveError: "Gagal menyimpan mood. Sila cuba lagi.",
            successTitle: "Mood Direkod! 🎉",
            successSubtitle: "Anda boleh merekod mood lain setiap kali perasaan anda berubah.",
            logAnother: "Rekod Lagi",
            logMoodButton: "Rekod Mood"
        },
        analytics: {
            title: "Analitik",
            heroTitle: "Laporan Kesejahteraan Mingguan",
            avgMood: "Purata Mood",
            entriesAnalyzed: "Entri Dianalisis",
            trend: "Trend",
            volatility: "Ketidaktentuan",
            bestHour: "Waktu Terbaik",
            toughestHour: "Waktu Paling Sukar",
            riskBanner: "Kami perasan isyarat emosi yang sukar minggu ini. Jika anda berasa terbeban, sila hubungi orang yang dipercayai atau sokongan profesional.",
            moodTrend: "Trend Mood",
            weekly: "Mingguan",
            monthly: "Bulanan",
            regen: "Jana Semula Analisis",
            regenerating: "Menjana semula...",
            loading: "Memuatkan Pandangan...",
            emptyTitle: "Pandangan Peribadi Anda Menanti",
            emptyText: "Rekod sekurang-kurangnya 3 entri mood untuk membuka kunci pengecaman corak AI, analisis pencetus, dan cadangan peribadi.",
            emptyProgress: "Entri minggu ini: {count} / 3 diperlukan",
            genFirst: "Jana Laporan Pertama",
            analyzing: "Menganalisis minggu anda...",
            summary: "Ringkasan Mingguan",
            patterns: "Corak Diperhatikan",
            highlights: "Sorotan Positif",
            recommendations: "Tindakan Disyorkan",
            triggers: "Pencetus Diperkenalkan",
            reason: "Sebab",
            observation: "Pemerhatian Kami",
            impactNotes: "Nota Impak",
            impact: "Impak",
            showAll: "Paparkan Semua Pencetus ({count})",
            showTop2: "Paparkan 2 Pencetus Teratas",
            stable: "Stabil",
            improving: "Meningkat",
            declining: "Menurun",
            lastGenerated: "Terakhir dijana: ",
            aiGenerated: "Dijana AI (Gemini)",
            safeAnalysis: "Analisis Tempatan Selamat",
            safetyCheck: "Semakan Keselamatan: ",
            approved: "DILULUSKAN",
            easy: "Mudah",
            medium: "Sederhana",
            difficult: "Sukar",
            moodStatus: {
                great: "Anda dalam aliran menaik dan melakukan yang hebat.",
                stable: "Anda stabil minggu ini.",
                declining: "Anda masih okay, tetapi mood menurun baru-baru ini.",
                mixedImproving: "Minggu ini bercampur-campur, tetapi bertambah baik.",
                mixedReset: "Minggu ini bercampur-campur. Perlahankan dan tetapkan semula.",
                heavy: "Minggu ini berasa berat. Sila utamakan sokongan."
            }
        },
        login: {
            welcome: "Selamat Kembali",
            createAccount: "Cipta Akaun",
            step: (current: number) => `Langkah ${current} daripada 3`,
            signinContinue: "Log masuk untuk teruskan",
            email: "Emel",
            password: "Kata Laluan",
            forgotPass: "Lupa Kata Laluan?",
            signingIn: "Log Masuk...",
            signIn: "Log Masuk",
            forgotPassDesc: "Masukkan alamat emel anda dan kami akan hantar pautan untuk tetapan semula kata laluan.",
            sendResetLink: "Hantar Pautan",
            sending: "Menghantar...",
            nextProfile: "Seterusnya: Profil",
            nextDetails: "Seterusnya: Butiran",
            fullName: "Nama Penuh",
            dob: "Tarikh Lahir",
            gender: "Jantina",
            selectGender: "Pilih Jantina",
            male: "Lelaki",
            female: "Perempuan",
            nonBinary: "Non-binary",
            preferNotToSay: "Sukar untuk dinyatakan",
            creating: "Mencipta...",
            or: "ATAU",
            google: "Teruskan dengan Google",
            noAccount: "Belum mempunyai akaun? ",
            hasAccount: "Sudah mempunyai akaun? ",
            signUp: "Daftar",
            verifyTitle: "Sahkan Emel Anda",
            verifySent: (email: string) => `Kami telah menghantar pautan ke ${email}.`,
            verifyCheck: "Sila semak peti masuk anda untuk mengaktifkan akaun anda.",
            resend: "Hantar Semula Emel",
            goToLogin: "Log Masuk",
            emailRequired: "Sila masukkan emel dan kata laluan",
            passLength: "Kata laluan mestilah sekurang-kurangnya 6 aksara",
            nameRequired: "Sila masukkan nama penuh anda",
            completeFields: "Sila lengkapkan semua medan",
            verifyFirst: "Sila sahkan emel anda terlebih dahulu",
            welcomeMsg: "Selamat kembali!",
            googleFailed: "Log Masuk Google Gagal",
            emailSent: "Emel dihantar! Semak peti masuk.",
            resendFailed: "Gagal hantar semula. Cuba log masuk semula.",
            resetSent: "Pautan tetapan semula dihantar! Semak peti masuk.",
            resetFailed: "Gagal hantar pautan. Pastikan emel adalah betul.",
            accountCreated: "Akaun dicipta! Sila sahkan emel.",
            completeProfileNotice: "Selamat datang! Sila lengkapkan persediaan profil anda di bawah."
        },
        journal: {
            title: "Jurnal Saya",
            subtitle: "Ruang selamat untuk fikiran dan emosi anda.",
            newPage: "Halaman Baru",
            selectCategory: "Pilih Kategori",
            categories: {
                personal: "Peribadi",
                work: "Kerja",
                health: "Kesihatan",
                reflection: "Refleksi",
                family: "Keluarga",
                other: "Lain-lain"
            },
            titlePlaceholder: "Tajuk entri anda...",
            contentPlaceholder: "Luahkan apa yang tersirat...",
            saveOnly: "Simpan Sahaja",
            saveTalkAi: "Simpan & Sembang dengan AI",
            emptyTitle: "Mulakan Perjalanan",
            emptyText: "Halaman ini menunggu kata-kata anda. Tulis sesuatu yang kecil hari ini.",
            writeNow: "Tulis Sekarang",
            aiAdvice: "Bincang dengan AI",
            aiReflectionPrompt: (title: string, category: string, content: string) => `Saya baru sahaja menulis entri jurnal bertajuk "${title}" dalam kategori ${category}. Inilah yang saya tulis: "${content}". Bolehkah anda berikan beberapa refleksi terapeutik atau nasihat berdasarkan ini?`,
            aiReflectionPromptShort: (title: string, content: string) => `Saya sedang memikirkan entri jurnal saya yang bertajuk "${title}": "${content}". Apakah nasihat yang boleh anda berikan kepada saya berdasarkan ini?`,
            toast: {
                loadFailed: "Gagal memuat jurnal",
                fieldsRequired: "Sila masukkan tajuk dan kandungan",
                updated: "Jurnal dikemas kini",
                saved: "Jurnal disimpan",
                deleteConfirm: "Adakah anda pasti mahu memadam jurnal ini?",
                deleted: "Jurnal dipadam",
                deleteFailed: "Gagal memadam jurnal",
                saveFailed: "Gagal menyimpan jurnal"
            }
        },
        therapist: {
            title: "Terapis Saya",
            heading: "Maklumat Terapis",
            subtitle: "Simpan maklumat terapis anda untuk membolehkan penghantaran laporan mingguan.",
            emptyState: "Anda belum menambah terapis lagi.",
            emptyAction: "Tambah maklumat mereka untuk membuka ciri Hantar Laporan.",
            addTherapist: "Tambah Terapis",
            labels: {
                name: "Nama penuh terapis",
                email: "Alamat emel terapis",
                phone: "Nombor telefon terapis",
                clinic: "Nama klinik / pusat (pilihan)",
                schedule: "Hari & waktu sesi",
                nextSession: "Tarikh sesi seterusnya",
                notes: "Nota peribadi tentang terapis anda"
            },
            actions: {
                save: "Simpan",
                saving: "Menyimpan...",
                delete: "Padam",
                edit: "Kemaskini",
                cancel: "Batal"
            },
            toast: {
                required: "Nama penuh dan emel terapis diperlukan.",
                saved: "Maklumat terapis disimpan.",
                saveFailed: "Gagal menyimpan maklumat terapis.",
                deleted: "Maklumat terapis dipadam.",
                deleteFailed: "Gagal memadam maklumat terapis.",
                deleteConfirm: "Padam maklumat terapis?"
            },
            notProvided: "Tidak disediakan"
        },
        helpPage: {
            title: "Bantuan & Sokongan",
            crisis: {
                title: "Bantuan Segera (Malaysia)",
                subtitle: "Jika anda dalam bahaya sekarang, hubungi talian kecemasan segera.",
                call: "Hubungi",
                website: "laman web"
            },
            faqTitle: "Soalan Lazim",
            faqs: [
                {
                    q: "Bagaimana cara menambah maklumat terapis saya?",
                    a: "Buka Terapis Saya dari menu profil, tekan Kemaskini, isi butiran, kemudian Simpan."
                },
                {
                    q: "Bagaimana cara menghantar laporan mingguan kepada terapis saya?",
                    a: "Pergi ke Analitik, semak ringkasan, tekan Hantar ke Terapis, dan sahkan Hantar Laporan."
                },
                {
                    q: "Adakah data saya peribadi dan selamat?",
                    a: "Data anda adalah peribadi untuk akaun anda. Perkongsian hanya berlaku apabila anda meluluskannya secara eksplisit."
                },
                {
                    q: "Bagaimana penjejak mood berfungsi?",
                    a: "Daftar masuk harian membina sejarah mood anda dan pandangan analitik mingguan."
                },
                {
                    q: "Apakah maksud tahap risiko?",
                    a: "Tahap risiko mencerminkan tekanan emosi berdasarkan trend mood, ketidaktentuan, dan isyarat laporan."
                },
                {
                    q: "Bagaimana cara memadam akaun atau data saya?",
                    a: "Emel support@mentex.app dari emel berdaftar anda dan minta pemadaman."
                },
                {
                    q: "Bolehkah terapis saya melihat entri jurnal saya?",
                    a: "Tidak. Terapis hanya melihat ringkasan yang anda pratonton dan lulusi sebelum dihantar."
                },
                {
                    q: "Apa yang perlu saya lakukan jika saya rasa pandangan AI salah?",
                    a: "Gunakan Hantar Maklum Balas dan harapkan nasihat profesional jika perlu."
                }
            ]
        }
    }
};
