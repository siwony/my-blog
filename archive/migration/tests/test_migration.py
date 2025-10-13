#!/usr/bin/env python3
"""
TIL Migration Test Script - 검증용
"""

import sys
sys.path.append('.')
from migrate_til import TILMigration
from pathlib import Path
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

def test_migration():
    """마이그레이션 테스트"""
    migrator = TILMigration()
    
    # 테스트할 파일들
    test_files = [
        Path("./til-source/Algorithm/2021-06-23-QuickSort.md"),
        Path("./til-source/DataBase/2020-12-22-Entity-Relationship-Diagram.md"),
        Path("./til-source/README.md")  # 제외 대상
    ]
    
    print("🔍 마이그레이션 스크립트 검증 시작")
    print("="*50)
    
    for test_file in test_files:
        if test_file.exists():
            print(f"\n📄 테스트 파일: {test_file}")
            
            # 제외 파일 체크
            if migrator.should_exclude_file(test_file):
                print("   ✅ 제외 파일로 올바르게 인식됨")
                continue
            
            # 카테고리 추출 테스트
            category = migrator.get_category_from_path(test_file)
            print(f"   📁 추출된 카테고리: {category}")
            
            # 날짜 추출 테스트
            date = migrator.extract_date_from_filename(test_file.name)
            print(f"   📅 추출된 날짜: {date}")
            
            # 파일 읽기 및 front matter 파싱 테스트
            try:
                with open(test_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                front_matter, body = migrator.parse_front_matter(content)
                print(f"   📋 Front Matter: {front_matter.get('title', 'N/A')}")
                
                # 새 front matter 생성 테스트
                new_fm = migrator.create_new_front_matter(front_matter, test_file, test_file.name, category)
                print(f"   ✨ 새 제목: {new_fm['title']}")
                print(f"   ✨ 새 카테고리: {new_fm['categories']}")
                
                # 새 파일명 생성 테스트
                new_filename = migrator.generate_new_filename(new_fm, test_file.name)
                print(f"   📝 새 파일명: {new_filename}")
                
                print("   ✅ 테스트 통과")
                
            except Exception as e:
                print(f"   ❌ 오류: {e}")
        else:
            print(f"   ⚠️  파일 없음: {test_file}")
    
    print("\n" + "="*50)
    print("🎉 스크립트 검증 완료!")

if __name__ == "__main__":
    test_migration()