// deepseek-config.js - النسخة المصححة
class DeepSeekConfig {
    constructor() {
        this.apiKey = null;
        this.isConfigured = false;
    }

    async initialize() {
        try {
            this.apiKey = await this.getSecureAPIKey();
            await this.validateAPIKey();
            this.isConfigured = true;
            return true;
        } catch (error) {
            console.error('فشل إعداد DeepSeek:', error);
            this.showSetupModal();
            return false;
        }
    }

   async getSecureAPIKey() {
    // يمكنك وضع المفتاح هنا مؤقتاً
    const hardcodedKey = 'sk-e641e381ea6142af8ec61746441b659d';
    const savedKey = localStorage.getItem('deepseek_secure_api_key') || hardcodedKey;
    
    if (savedKey && savedKey.startsWith('sk-')) {
        return savedKey;
    }
    // باقي الكود...
}
    showAPIKeyModal(resolve, reject) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        modal.innerHTML = `
            <div style="
                background: #001100;
                border: 3px solid #00ff00;
                padding: 2rem;
                max-width: 500px;
                text-align: center;
                color: #ffffff;
            ">
                <h2 style="color: #00ff00; margin-bottom: 1rem;">🔧 إعداد مفتاح API</h2>
                <p style="margin-bottom: 1rem; color: #00ff00;">
                    يرجى إدخال مفتاح DeepSeek API لتفعيل التحليلات الذكية
                </p>
                
                <input type="password" 
                       id="apiKeyInput" 
                       placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                       style="
                           width: 100%;
                           padding: 0.8rem;
                           margin: 1rem 0;
                           background: #000;
                           border: 1px solid #00ff00;
                           color: #fff;
                           font-family: 'Courier New', monospace;
                       ">
                
                <div style="margin: 1rem 0;">
                    <a href="https://platform.deepseek.com/api_keys" 
                       target="_blank"
                       style="color: #00ffff; text-decoration: underline;">
                       🔗 احصل على مفتاح API من هنا
                    </a>
                </div>

                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="window.saveNewAPIKey()" 
                            style="
                                background: #00ff00;
                                color: #000;
                                border: none;
                                padding: 0.8rem 1.5rem;
                                cursor: pointer;
                                font-weight: bold;
                            ">
                        💾 حفظ المفتاح
                    </button>
                    <button onclick="window.closeAPIKeyModal()"
                            style="
                                background: #ff0000;
                                color: #fff;
                                border: none;
                                padding: 0.8rem 1.5rem;
                                cursor: pointer;
                            ">
                        ❌ إلغاء
                    </button>
                </div>

                <p style="margin-top: 1rem; font-size: 0.8rem; color: #888;">
                    🔒 سيتم حفظ المفتاح فقط في متصفحك ولن يشارك مع أي شخص
                </p>
            </div>
        `;

        document.body.appendChild(modal);

        // تعريف الدوال globally للوصول من الأزرار
        window.saveNewAPIKey = () => {
            const keyInput = document.getElementById('apiKeyInput');
            const apiKey = keyInput.value.trim();

            if (!apiKey) {
                alert('⚠️ يرجى إدخال مفتاح API');
                return;
            }

            if (!apiKey.startsWith('sk-')) {
                alert('❌ مفتاح API غير صالح. يجب أن يبدأ بـ sk-');
                return;
            }

            // حفظ المفتاح في localStorage
            localStorage.setItem('deepseek_secure_api_key', apiKey);
            modal.remove();
            resolve(apiKey);
        };

        window.closeAPIKeyModal = () => {
            modal.remove();
            reject(new Error('تم إلغاء إدخال مفتاح API'));
        };

        // التركيز على حقل الإدخال
        setTimeout(() => {
            document.getElementById('apiKeyInput').focus();
        }, 100);
    }

    async validateAPIKey() {
        if (!this.apiKey) {
            throw new Error('لم يتم توفير مفتاح API');
        }

        try {
            const response = await fetch('https://api.deepseek.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // مفتاح غير صالح - نحذفه
                    localStorage.removeItem('deepseek_secure_api_key');
                    throw new Error('مفتاح API غير صالح. يرجى التحقق وإعادة الإدخال.');
                }
                throw new Error(`خطأ في التحقق: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('خطأ في التحقق من المفتاح:', error);
            throw error;
        }
    }

    showSetupModal() {
        // عرض واجهة إعداد API
        this.showAPIKeyModal(
            (apiKey) => {
                this.apiKey = apiKey;
                this.isConfigured = true;
                location.reload(); // إعادة تحميل الصفحة بعد الإعداد
            },
            (error) => {
                console.error('فشل إعداد API:', error);
                this.showErrorMessage();
            }
        );
    }

    showErrorMessage() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #330000;
            border: 2px solid #ff0000;
            padding: 2rem;
            color: #ff0000;
            z-index: 10000;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>❌ تعذر تحميل DeepSeek AI</h3>
            <p>يجب إعداد مفتاح API لاستخدام التحليلات الذكية.</p>
            <button onclick="location.reload()" 
                    style="
                        background: #ff0000;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        margin-top: 1rem;
                        cursor: pointer;
                    ">
                🔄 إعادة المحاولة
            </button>
        `;
        document.body.appendChild(errorDiv);
    }

    // دالة لمسح المفتاح (للاستخدام في حالة التسريب)
    clearAPIKey() {
        localStorage.removeItem('deepseek_secure_api_key');
        this.apiKey = null;
        this.isConfigured = false;
        alert('تم مسح مفتاح API. يرجى إدخال مفتاح جديد.');
    }

    getHeaders() {
        if (!this.isConfigured) {
            throw new Error('DeepSeek API غير مهيء');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };
    }
}

// خدمة DeepSeek المعدلة
class SecureDeepSeekService {
    constructor() {
        this.config = new DeepSeekConfig();
        this.isInitialized = false;
    }

    async initialize() {
        try {
            const success = await this.config.initialize();
            this.isInitialized = success;
            return success;
        } catch (error) {
            console.error('فشل تهيئة خدمة DeepSeek:', error);
            this.isInitialized = false;
            return false;
        }
    }

    async sendMessage(messages, options = {}) {
        if (!this.isInitialized) {
            throw new Error('الخدمة غير مهيأة. يرجى التحقق من إعداد API.');
        }

        const payload = {
            model: options.model || 'deepseek-chat',
            messages: messages,
            max_tokens: options.max_tokens || 2000,
            temperature: options.temperature || 0.7,
            stream: false
        };

        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: this.config.getHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // مفتاح غير صالح - نمسحه ونطلب إعادة الإدخال
                    this.config.clearAPIKey();
                    throw new Error('مفتاح API غير صالح. يرجى إعادة الإدخال.');
                }
                throw new Error(`خطأ في API: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('خطأ في استدعاء DeepSeek API:', error);
            throw error;
        }
    }

    // دالة مساعدة للتحليل الجيوسياسي
    async analyzeGeopolitical(query, context = '') {
        const systemMessage = {
            role: 'system',
            content: `أنت محلل جيوسياسي خبير في منصة الذكاء الاستراتيجي. 
            قدم تحليلاً مفصلاً ثنائي اللغة (الإنجليزية والعربية) مع:
            - تقييم المخاطر والفرص
            - التحليل الاستراتيجي  
            - التوصيات العملية
            - التوقعات المستقبلية
            
            دائماً قدم الإجابة باللغتين مع تنسيق واضح.`
        };

        const userMessage = {
            role: 'user',
            content: `السياق: ${context}\n\nالاستفسار: ${query}`
        };

        return await this.sendMessage([systemMessage, userMessage], {
            max_tokens: 3000,
            temperature: 0.5
        });
    }
}

// جعل الخدمة متاحة globally
window.SecureDeepSeekService = SecureDeepSeekService;
window.DeepSeekConfig = DeepSeekConfig;