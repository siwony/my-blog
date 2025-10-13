# TIL to Jekyll Blog Migration Archive

이 폴더는 TIL(Today I Learned) 콘텐츠를 Jekyll 블로그로 마이그레이션하는 과정에서 사용된 모든 파일들을 보관하고 있습니다.

## 마이그레이션 완료 정보
- **마이그레이션 완료일**: 2025년 10월 13일
- **마이그레이션된 파일 수**: 268개 포스트
- **성공률**: 100% (263/263 파일 성공적으로 마이그레이션)
- **카테고리 수**: 10개 (back-end, programming, database, cs, network, devops, book, algorithm, os, git)
- **이미지 파일 수**: 202개

## 폴더 구조

### 📁 scripts/
마이그레이션 과정에서 사용된 Python 스크립트들
- `migrate_til.py`: 메인 마이그레이션 스크립트
- `test_migration.py`: 마이그레이션 테스트 스크립트
- `test_category.py`: 카테고리 테스트 스크립트

### 📁 logs/
마이그레이션 과정에서 생성된 로그 파일들
- `migration.log`: 마이그레이션 실행 로그

### 📁 docs/
마이그레이션 관련 문서들
- `TIL_MIGRATION_GUIDE.md`: 마이그레이션 가이드 문서
- `TIL_MIGRATION_EXCLUDE_FILES.md`: 마이그레이션에서 제외된 파일 목록
- `TIL_IMAGE_MIGRATION_EXCEPTIONS.md`: 이미지 마이그레이션 예외 사항

### 📁 source-data/
원본 TIL 데이터
- `til-source/`: 원본 TIL 마크다운 파일들과 이미지들

## 마이그레이션 주요 특징

1. **카테고리 보존**: 원본 front matter의 카테고리를 우선적으로 보존
2. **이미지 정리**: 카테고리별로 이미지 파일들을 체계적으로 정리
3. **메타데이터 변환**: Jekyll 호환 front matter로 자동 변환
4. **파일명 정규화**: Jekyll 규칙에 맞는 파일명으로 변경

## 사용된 도구

- **Python 3.9.6**: 메인 마이그레이션 스크립트 실행
- **PyYAML**: YAML front matter 처리
- **Ruby**: 카테고리 페이지 생성
- **Jekyll 3.9.5**: 정적 사이트 생성

## 보관 목적

이 archive는 다음과 같은 목적으로 보관됩니다:
1. 마이그레이션 과정의 기록 보존
2. 향후 유사한 마이그레이션 작업 시 참고 자료
3. 문제 발생 시 원본 데이터 복구 가능
4. 마이그레이션 스크립트의 재사용 가능

---
**참고**: 이 archive의 파일들은 마이그레이션 완료 후 더 이상 활성적으로 사용되지 않으며, 기록 보존 목적으로만 유지됩니다.