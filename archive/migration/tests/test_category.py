#!/usr/bin/env python3
import sys
from pathlib import Path
sys.path.append('.')
from migrate_til import TILMigration

def test_category_migration():
    """카테고리 마이그레이션 테스트"""
    migration = TILMigration()
    
    # 테스트할 파일들
    test_files = [
        "til-source/DevOps/docker/2021-05-29-container-rm.md",  # categories: DevOps
        "til-source/DataBase/2020-12-20-relational-database.md",  # categories: DataBase
        "til-source/programming/java/2022-03-29-jvm.md"  # categories가 없음 (경로 기반)
    ]
    
    for file_path in test_files:
        source_file = Path(file_path)
        if source_file.exists():
            print(f"\n=== 테스트: {source_file} ===")
            
            # 파일 읽기
            with open(source_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Front Matter 파싱
            old_front_matter, body = migration.parse_front_matter(content)
            
            # 카테고리 결정
            category = migration.get_category_from_source(source_file, old_front_matter)
            
            print(f"원본 categories: {old_front_matter.get('categories', '없음')}")
            print(f"결정된 category: {category}")
            
            # 실제 마이그레이션 실행
            migration.migrate_file(source_file)
        else:
            print(f"파일 없음: {file_path}")

if __name__ == "__main__":
    test_category_migration()