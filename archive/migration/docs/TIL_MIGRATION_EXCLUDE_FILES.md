# TIL 마이그레이션 제외 파일 목록

## 📋 개요
이 문서는 TIL에서 Jekyll 블로그로 마이그레이션할 때 **제외해야 할 파일들**을 정리한 목록입니다.

## 🚫 마이그레이션 제외 파일 (5개)

### 1. 프로젝트 루트 문서
```
./til-source/README.md
./til-source/MARKDOWN_METADATA.md
```
**제외 이유**: 
- README.md: 프로젝트 설명 파일로 블로그 포스트가 아님
- MARKDOWN_METADATA.md: 메타데이터 설명 파일로 블로그 포스트가 아님

### 2. Book 디렉토리 README 파일들
```
./til-source/Book/README.md
./til-source/Book/쉽게-배우는-소프트웨어-공학./README.md
./til-source/Book/object-orientation-facts-and-misconceptions/README.md
```
**제외 이유**: 
- 각 책 폴더의 설명 파일들
- 실제 콘텐츠가 아닌 디렉토리 안내용 문서들

## ✅ 마이그레이션 대상 파일

### 총 통계
- **전체 마크다운 파일**: 270개
- **마이그레이션 대상**: 265개 (98.1%)
- **제외 파일**: 5개 (1.9%)

### Jekyll 규칙 준수 현황
- **Jekyll 규칙 준수**: 263개 (날짜 형식 `YYYY-MM-DD-title.md`)
- **특별 처리 필요**: 2개 (빈 파일이므로 무시 가능)
  - `./til-source/DataBase/sql/join.md`
  - `./til-source/DevOps/aws/AWS-Auto-Scaling.md`

## 🤖 AI 처리 지침

### 파일 필터링 규칙
```python
# 제외할 파일 패턴
EXCLUDE_PATTERNS = [
    "README.md",
    "MARKDOWN_METADATA.md"
]

# 제외할 파일 전체 경로
EXCLUDE_FILES = [
    "./til-source/README.md",
    "./til-source/MARKDOWN_METADATA.md", 
    "./til-source/Book/README.md",
    "./til-source/Book/쉽게-배우는-소프트웨어-공학./README.md",
    "./til-source/Book/object-orientation-facts-and-misconceptions/README.md"
]

def should_migrate_file(file_path):
    """파일이 마이그레이션 대상인지 확인"""
    return file_path not in EXCLUDE_FILES
```

### 마이그레이션 처리 방법
1. **일반 처리**: Jekyll 규칙에 맞는 263개 파일은 정상 마이그레이션
2. **제외 처리**: 위 5개 파일은 복사하지 않음
3. **특별 처리**: 빈 파일 2개는 무시 (콘텐츠 없음)

## 🗂️ 파일 유형별 분류

### 📁 문서/설명 파일 (제외)
- 프로젝트 README
- 폴더별 설명 파일
- 메타데이터 문서

### 📝 실제 콘텐츠 (마이그레이션)
- 기술 학습 노트
- 개발 경험 정리
- 문제 해결 과정

### 📊 빈 파일 (무시)
- join.md (내용 없음)
- AWS-Auto-Scaling.md (내용 없음)

## 💡 참고사항

### 한국어 사용자를 위한 설명
- **README.md**: 각 폴더의 목차나 설명이 적힌 파일들입니다. 블로그 포스트로는 적합하지 않아 제외합니다.
- **MARKDOWN_METADATA.md**: 마크다운 작성 규칙을 설명한 파일로, 블로그 콘텐츠가 아닙니다.
- **특별 처리 파일**: 파일은 존재하지만 내용이 비어있어서 마이그레이션할 필요가 없습니다.

### AI 처리 시 주의사항
- 제외 파일들은 복사하지 않음
- 로그에 제외된 파일 수를 기록
- 최종 마이그레이션 통계에서 제외 파일 수 표시

---
**목적**: TIL to Jekyll 마이그레이션 시 제외 파일 관리  
**대상**: AI 에이전트 및 한국어 사용자