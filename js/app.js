// アプリケーションのメイン処理

// タブ切り替え機能
function showTab(tabId) {
    // すべてのタブとコンテンツを非アクティブに
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 選択されたタブとコンテンツをアクティブに
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// 初期化処理
function init() {
    displayProductCards();
    populateProductSelects();
    displayECTable();
}

// 製品カード表示
function displayProductCards() {
    const container = document.getElementById('product-cards');
    container.innerHTML = '';
    
    Object.values(products).forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-name">${product.name}</div>
            <p style="color: #6c757d; margin-bottom: 15px; font-size: 14px;">${product.description}</p>
            <table class="component-table">
                <tr><th>成分</th><th>含有率(%)</th></tr>
                <tr><td>窒素全量(TN)</td><td>${product.components.TN}%</td></tr>
                <tr><td>アンモニア性窒素(AN)</td><td>${product.components.AN > 0 ? product.components.AN + '%' : '(-)'}</td></tr>
                <tr><td>硝酸性窒素(NN)</td><td>(${product.components.NN}%)</td></tr>
                <tr><td>水溶性りん酸(WP)</td><td>${product.components.WP}%</td></tr>
                <tr><td>水溶性加里(WK)</td><td>${product.components.WK}%</td></tr>
                <tr><td>く溶性苦土(CMg)</td><td>${product.components.CMg}%</td></tr>
                <tr><td>カルシウム(Ca)</td><td>${product.components.Ca}%</td></tr>
            </table>
        `;
        container.appendChild(card);
    });
}

// EC値一覧表示
function displayECTable() {
    const tbody = document.getElementById('ec-table-body');
    tbody.innerHTML = '';
    
    Object.values(products).forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: bold;">${product.name}</td>
            <td>${product.ec[100]}</td>
            <td>${product.ec[200]}</td>
            <td>${product.ec[500]}</td>
            <td>${product.ec[750]}</td>
            <td>${product.ec[1000]}</td>
            <td>${product.ec[2000]}</td>
            <td>${product.ec[4000]}</td>
        `;
        tbody.appendChild(row);
    });
}

// セレクトボックスに製品を追加
function populateProductSelects() {
    const selects = ['product-select', 'quick-product-select'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">製品を選択してください</option>';
        Object.keys(products).forEach(productKey => {
            const option = document.createElement('option');
            option.value = productKey;
            option.textContent = products[productKey].name;
            select.appendChild(option);
        });
    });
}

// 使用量計算
function calculateUsage() {
    const productKey = document.getElementById('product-select').value;
    const tankRatio = parseFloat(document.getElementById('tank-ratio').value);
    const injectionRatio = parseFloat(document.getElementById('injection-ratio').value);
    const flowRate = parseFloat(document.getElementById('flow-rate').value);

    if (!productKey || !tankRatio || !injectionRatio || !flowRate) {
        alert('すべての項目を入力してください。');
        return;
    }

    const product = products[productKey];
    
    // 製品使用量計算 (kg)
    const productUsage = flowRate / (tankRatio * injectionRatio);
    
    // 各成分の施用量計算 (g/10a/日)
    const components = {
        TN: (productUsage * 1000 * product.components.TN / 100),
        NN: (productUsage * 1000 * product.components.NN / 100),
        WP: (productUsage * 1000 * product.components.WP / 100),
        WK: (productUsage * 1000 * product.components.WK / 100),
        CMg: (productUsage * 1000 * product.components.CMg / 100),
        Ca: (productUsage * 1000 * product.components.Ca / 100)
    };

    // 30日間の施用量計算 (kg/10a/30日)
    const monthly = {
        TN: (components.TN * 30 / 1000),
        NN: (components.NN * 30 / 1000),
        WP: (components.WP * 30 / 1000),
        WK: (components.WK * 30 / 1000),
        CMg: (components.CMg * 30 / 1000),
        Ca: (components.Ca * 30 / 1000)
    };

    // 結果表示
    displayCalculationResults(product, productUsage, components, monthly);
}

// 計算結果の表示
function displayCalculationResults(product, productUsage, components, monthly) {
    const resultsContainer = document.getElementById('calculation-results');
    const resultsContent = document.getElementById('results-content');
    
    resultsContent.innerHTML = `
        <div class="result-item">
            <span class="result-label">選択製品</span>
            <span class="result-value highlight">${product.name}</span>
        </div>
        <div class="result-item">
            <span class="result-label">製品使用量</span>
            <span class="result-value">${productUsage.toFixed(2)} kg</span>
        </div>
        <hr style="margin: 20px 0;">
        <h4 style="margin-bottom: 15px; color: #2c3e50;">日当たり成分施用量 (g/10a/日)</h4>
        <div class="result-item">
            <span class="result-label">窒素全量(TN)</span>
            <span class="result-value">${components.TN.toFixed(1)} g</span>
        </div>
        <div class="result-item">
            <span class="result-label">硝酸性窒素(NN)</span>
            <span class="result-value">${components.NN.toFixed(1)} g</span>
        </div>
        <div class="result-item">
            <span class="result-label">水溶性りん酸(WP)</span>
            <span class="result-value">${components.WP.toFixed(1)} g</span>
        </div>
        <div class="result-item">
            <span class="result-label">水溶性加里(WK)</span>
            <span class="result-value">${components.WK.toFixed(1)} g</span>
        </div>
        <div class="result-item">
            <span class="result-label">く溶性苦土(CMg)</span>
            <span class="result-value">${components.CMg.toFixed(1)} g</span>
        </div>
        <div class="result-item">
            <span class="result-label">カルシウム(Ca)</span>
            <span class="result-value">${components.Ca.toFixed(1)} g</span>
        </div>
        <hr style="margin: 20px 0;">
        <h4 style="margin-bottom: 15px; color: #2c3e50;">月間成分施用量 (kg/10a/30日)</h4>
        <div class="result-item">
            <span class="result-label">窒素全量(TN)</span>
            <span class="result-value">${monthly.TN.toFixed(2)} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">硝酸性窒素(NN)</span>
            <span class="result-value">${monthly.NN.toFixed(2)} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">水溶性りん酸(WP)</span>
            <span class="result-value">${monthly.WP.toFixed(2)} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">水溶性加里(WK)</span>
            <span class="result-value">${monthly.WK.toFixed(2)} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">く溶性苦土(CMg)</span>
            <span class="result-value">${monthly.CMg.toFixed(2)} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">カルシウム(Ca)</span>
            <span class="result-value">${monthly.Ca.toFixed(2)} kg</span>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

// 早見表更新
function updateQuickTable() {
    const productKey = document.getElementById('quick-product-select').value;
    const container = document.getElementById('quick-table-container');
    
    if (!productKey) {
        container.innerHTML = '';
        return;
    }

    const product = products[productKey];
    
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #2c3e50; margin-bottom: 10px;">${product.name} 早見表</h3>
            <p style="color: #6c757d;">${product.description}</p>
            <p style="color: #e74c3c; font-weight: bold; margin-top: 10px;">上段：製品使用量(kg/10a/日) / 下段：窒素施用量(g/10a/日)</p>
        </div>
        
        <h4 style="margin: 20px 0 10px 0; color: #2c3e50;">タンク5倍設定</h4>
        <div class="table-wrapper">
            <table class="quick-table">
                <thead>
                    <tr>
                        <th>希釈倍率</th>
                        <th>1t</th>
                        <th>2t</th>
                        <th>3t</th>
                        <th>4t</th>
                        <th>5t</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateQuickTableRows(5, product)}
                </tbody>
            </table>
        </div>
        
        <h4 style="margin: 30px 0 10px 0; color: #2c3e50;">タンク10倍設定</h4>
        <div class="table-wrapper">
            <table class="quick-table">
                <thead>
                    <tr>
                        <th>希釈倍率</th>
                        <th>1t</th>
                        <th>2t</th>
                        <th>3t</th>
                        <th>4t</th>
                        <th>5t</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateQuickTableRows(10, product)}
                </tbody>
            </table>
        </div>
    `;
}

// 早見表行生成
function generateQuickTableRows(tankRatio, product) {
    const dilutionRatios = [100, 200, 300, 400, 500, 600];
    const fieldSizes = [1000, 2000, 3000, 4000, 5000];
    
    return dilutionRatios.map(dilution => {
        const cells = fieldSizes.map(size => {
            // 製品使用量計算 (kg/10a/日)
            const productUsage = size / (tankRatio * dilution);
            // 窒素施用量計算 (g/10a/日)
            const nitrogenUsage = productUsage * 1000 * product.components.TN / 100;
            
            return `<td style="font-size: 12px; line-height: 1.4;">
                <div style="font-weight: bold; color: #2c3e50;">${productUsage.toFixed(productUsage < 1 ? 2 : 1)} kg</div>
                <div style="color: #e74c3c; font-size: 11px;">${nitrogenUsage.toFixed(1)} g</div>
            </td>`;
        }).join('');
        
        return `<tr><td style="font-weight: bold;">${dilution}倍</td>${cells}</tr>`;
    }).join('');
}

// ページ読み込み時に初期化
window.addEventListener('DOMContentLoaded', init);