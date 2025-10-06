#!/usr/bin/env node

/**
 * CI/CD용 테스트 실행 스크립트
 * GitHub Actions나 다른 CI 환경에서 사용할 수 있습니다.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
    constructor() {
        this.projectRoot = process.cwd();
        this.results = {
            success: false,
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            coverage: null,
            errors: []
        };
    }

    async run() {
        console.log('🚀 Prism.js 테스트 스위트 실행 시작\n');

        try {
            // 1. 의존성 확인
            await this.checkDependencies();

            // 2. 테스트 실행
            await this.runTests();

            // 3. 커버리지 확인
            await this.checkCoverage();

            // 4. 결과 보고
            this.generateReport();

        } catch (error) {
            console.error('❌ 테스트 실행 중 오류 발생:', error.message);
            this.results.errors.push(error.message);
            process.exit(1);
        }
    }

    async checkDependencies() {
        console.log('📦 의존성 확인 중...');

        // package.json 존재 확인
        if (!fs.existsSync(path.join(this.projectRoot, 'package.json'))) {
            throw new Error('package.json이 존재하지 않습니다.');
        }

        // node_modules 확인
        if (!fs.existsSync(path.join(this.projectRoot, 'node_modules'))) {
            console.log('📥 의존성 설치 중...');
            execSync('npm install', { stdio: 'inherit' });
        }

        console.log('✅ 의존성 확인 완료\n');
    }

    async runTests() {
        console.log('🧪 테스트 실행 중...');

        try {
            // Jest 실행
            const output = execSync('npm test -- --json', { 
                encoding: 'utf8',
                cwd: this.projectRoot 
            });

            const testResults = JSON.parse(output);
            
            this.results.success = testResults.success;
            this.results.totalTests = testResults.numTotalTests;
            this.results.passedTests = testResults.numPassedTests;
            this.results.failedTests = testResults.numFailedTests;

            if (testResults.success) {
                console.log('✅ 모든 테스트 통과');
            } else {
                console.log('❌ 일부 테스트 실패');
                testResults.testResults.forEach(result => {
                    if (result.status === 'failed') {
                        console.log(`   - ${result.name}`);
                        result.assertionResults.forEach(assertion => {
                            if (assertion.status === 'failed') {
                                console.log(`     ${assertion.title}: ${assertion.failureMessages.join(', ')}`);
                            }
                        });
                    }
                });
            }

        } catch (error) {
            throw new Error(`테스트 실행 실패: ${error.message}`);
        }

        console.log('');
    }

    async checkCoverage() {
        console.log('📊 코드 커버리지 확인 중...');

        try {
            execSync('npm run test:coverage -- --silent', { 
                stdio: 'inherit',
                cwd: this.projectRoot 
            });

            // 커버리지 결과 읽기
            const coveragePath = path.join(this.projectRoot, 'tests/coverage/coverage-summary.json');
            if (fs.existsSync(coveragePath)) {
                const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
                this.results.coverage = coverage.total;
                
                console.log(`📈 커버리지: ${this.results.coverage.lines.pct}% (라인), ${this.results.coverage.functions.pct}% (함수)`);
            }

        } catch (error) {
            console.log('⚠️ 커버리지 정보를 가져올 수 없습니다:', error.message);
        }

        console.log('');
    }

    generateReport() {
        console.log('📋 테스트 결과 보고서');
        console.log('=' .repeat(50));
        console.log(`총 테스트: ${this.results.totalTests}개`);
        console.log(`✅ 통과: ${this.results.passedTests}개`);
        console.log(`❌ 실패: ${this.results.failedTests}개`);
        
        if (this.results.coverage) {
            console.log(`📊 라인 커버리지: ${this.results.coverage.lines.pct}%`);
            console.log(`📊 함수 커버리지: ${this.results.coverage.functions.pct}%`);
        }

        const successRate = (this.results.passedTests / this.results.totalTests * 100).toFixed(1);
        console.log(`🎯 성공률: ${successRate}%`);

        if (this.results.errors.length > 0) {
            console.log('\n🚨 오류 목록:');
            this.results.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        console.log('=' .repeat(50));

        // HTML 보고서 생성
        this.generateHTMLReport();

        if (this.results.success) {
            console.log('🎉 모든 테스트가 성공적으로 완료되었습니다!');
        } else {
            console.log('⚠️ 일부 테스트가 실패했습니다. 위의 오류를 확인해주세요.');
            process.exit(1);
        }
    }

    generateHTMLReport() {
        const reportHTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prism.js 테스트 보고서</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .success { color: #28a745; }
        .failure { color: #dc3545; }
        .warning { color: #ffc107; }
        .metric { display: inline-block; margin: 10px; padding: 15px; border-radius: 5px; background: #f8f9fa; }
        .coverage-bar { width: 200px; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; }
        .coverage-fill { height: 100%; background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%); }
    </style>
</head>
<body>
    <h1>🧪 Prism.js 테스트 보고서</h1>
    <p><strong>실행 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
    
    <h2>📊 테스트 결과</h2>
    <div class="metric">
        <strong>총 테스트:</strong> ${this.results.totalTests}개
    </div>
    <div class="metric success">
        <strong>✅ 통과:</strong> ${this.results.passedTests}개
    </div>
    <div class="metric ${this.results.failedTests > 0 ? 'failure' : 'success'}">
        <strong>${this.results.failedTests > 0 ? '❌' : '✅'} 실패:</strong> ${this.results.failedTests}개
    </div>
    
    ${this.results.coverage ? `
    <h2>📈 코드 커버리지</h2>
    <div class="metric">
        <strong>라인 커버리지:</strong> ${this.results.coverage.lines.pct}%
        <div class="coverage-bar">
            <div class="coverage-fill" style="width: ${this.results.coverage.lines.pct}%"></div>
        </div>
    </div>
    <div class="metric">
        <strong>함수 커버리지:</strong> ${this.results.coverage.functions.pct}%
        <div class="coverage-bar">
            <div class="coverage-fill" style="width: ${this.results.coverage.functions.pct}%"></div>
        </div>
    </div>
    ` : ''}
    
    <h2>🎯 종합 평가</h2>
    <div class="metric ${this.results.success ? 'success' : 'failure'}">
        <strong>결과:</strong> ${this.results.success ? '🎉 성공' : '⚠️ 실패'}
    </div>
    
    ${this.results.errors.length > 0 ? `
    <h2>🚨 오류 목록</h2>
    <ul>
        ${this.results.errors.map(error => `<li class="failure">${error}</li>`).join('')}
    </ul>
    ` : ''}
    
    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d;">
        <p>이 보고서는 자동으로 생성되었습니다.</p>
    </footer>
</body>
</html>
        `.trim();

        const reportPath = path.join(this.projectRoot, 'test-report.html');
        fs.writeFileSync(reportPath, reportHTML);
        console.log(`📄 HTML 보고서가 생성되었습니다: ${reportPath}`);
    }
}

// 스크립트 실행
if (require.main === module) {
    const runner = new TestRunner();
    runner.run().catch(console.error);
}

module.exports = TestRunner;