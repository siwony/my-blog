#!/usr/bin/env python3
"""
TIL to Jekyll Blog Migration Script

이 스크립트는 다음 문서들을 기반으로 작성되었습니다:
- TIL_MIGRATION_GUIDE.md
- TIL_IMAGE_MIGRATION_EXCEPTIONS.md  
- TIL_MIGRATION_EXCLUDE_FILES.md
"""

import os
import re
import shutil
import yaml
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('migration.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class TILMigration:
    def __init__(self):
        self.source_dir = Path("./til-source")
        self.target_posts_dir = Path("./_posts")
        self.target_images_dir = Path("./assets/images/posts")
        
        # 제외할 파일들 (TIL_MIGRATION_EXCLUDE_FILES.md 기준)
        self.exclude_files = {
            "./til-source/README.md",
            "./til-source/MARKDOWN_METADATA.md",
            "./til-source/Book/README.md",
            "./til-source/Book/쉽게-배우는-소프트웨어-공학./README.md",
            "./til-source/Book/object-orientation-facts-and-misconceptions/README.md"
        }
        
        # 카테고리 매핑 (디렉토리 기반으로만 사용, front matter categories는 원본 유지)
        self.category_mapping = {
            "Algorithm": "programming",
            "Book": "general", 
            "DataBase": "programming",
            "DevOps": "programming",
            "ETC": "general",
            "Git": "programming",
            "OS": "programming",
            "back-end": "programming",
            "cs": "programming",
            "network": "programming",
            "programming": "programming"
        }
        
        # 통계
        self.stats = {
            'processed': 0,
            'skipped': 0,
            'errors': 0,
            'images_copied': 0,
            'excluded': 0
        }
        
    def should_exclude_file(self, file_path: Path) -> bool:
        """파일이 제외 대상인지 확인"""
        file_str = str(file_path)
        for exclude_pattern in self.exclude_files:
            if exclude_pattern in file_str or file_path.name in ["README.md", "MARKDOWN_METADATA.md"]:
                return True
        return False
    
    def get_category_from_path(self, file_path: Path) -> str:
        """파일 경로에서 카테고리 추출"""
        parts = file_path.parts
        if len(parts) > 2:  # til-source/category/...
            category_dir = parts[1]
            return self.category_mapping.get(category_dir, "general")
        return "general"
    
    def get_category_from_source(self, file_path: Path, front_matter: Dict) -> str:
        """원본 파일에서 카테고리 추출 (front matter 우선, 없으면 경로 기반)"""
        # 1. 원본 front matter에서 categories 확인
        if 'categories' in front_matter:
            original_category = front_matter['categories']
            if isinstance(original_category, list):
                original_category = original_category[0] if original_category else None
            
            if original_category:
                # 원본 카테고리를 소문자로 변환해서 그대로 사용
                return original_category.lower()
        
        # 2. front matter에 없으면 경로 기반으로 결정
        return self.get_category_from_path(file_path)
    
    def extract_date_from_filename(self, filename: str) -> Optional[str]:
        """파일명에서 날짜 추출"""
        date_pattern = r'(\d{4}-\d{2}-\d{2})'
        match = re.search(date_pattern, filename)
        return match.group(1) if match else None
    
    def sanitize_title(self, title: str) -> str:
        """제목을 파일명에 적합하게 변환"""
        # 한글, 영문, 숫자, 하이픈, 언더스코어만 허용
        title = re.sub(r'[^\w\s가-힣-]', '', title)
        title = re.sub(r'\s+', '-', title.strip())
        title = title.lower()
        return title[:50]  # 50자 제한
    
    def parse_front_matter(self, content: str) -> Tuple[Dict, str]:
        """Front Matter 파싱"""
        if not content.startswith('---'):
            return {}, content
            
        try:
            # Front Matter 추출
            parts = content.split('---', 2)
            if len(parts) >= 3:
                front_matter = yaml.safe_load(parts[1])
                body = parts[2].strip()
                return front_matter, body
        except yaml.YAMLError as e:
            logger.warning(f"YAML 파싱 오류: {e}")
            
        return {}, content
    
    def create_new_front_matter(self, old_front_matter: Dict, file_path: Path, 
                              filename: str, category: str) -> Dict:
        """새로운 Front Matter 생성"""
        # 제목 추출
        title = old_front_matter.get('title', filename.replace('.md', ''))
        
        # 날짜 추출 (우선순위: front matter > filename > current date)
        date_str = None
        if 'date' in old_front_matter:
            date_str = str(old_front_matter['date'])
        else:
            extracted_date = self.extract_date_from_filename(filename)
            if extracted_date:
                date_str = f"{extracted_date} 00:00:00 +0900"
            else:
                date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S +0900")
        
        # 기존 태그 추출 및 새 태그 추가
        existing_tags = old_front_matter.get('tags', [])
        if isinstance(existing_tags, str):
            existing_tags = [existing_tags]
        
        new_tags = list(existing_tags) if existing_tags else []
        new_tags.append("TIL")
        
        # 카테고리별 기본 태그 추가
        if category == "programming":
            new_tags.extend(["development", "coding"])
        elif category == "general":
            new_tags.extend(["knowledge", "learning"])
            
        # 중복 제거
        new_tags = list(set(new_tags))
        
        return {
            'layout': 'post',
            'title': title,
            'date': date_str,
            'categories': category,
            'tags': new_tags,
            'author': 'jeongcool'
        }
    
    def generate_new_filename(self, front_matter: Dict, original_filename: str) -> str:
        """새 파일명 생성"""
        # 날짜 추출
        date_str = front_matter.get('date', '')
        date_match = re.search(r'(\d{4}-\d{2}-\d{2})', str(date_str))
        date_part = date_match.group(1) if date_match else datetime.now().strftime("%Y-%m-%d")
        
        # 제목 추출 및 정제
        title = front_matter.get('title', original_filename.replace('.md', ''))
        title_part = self.sanitize_title(title)
        
        return f"{date_part}-{title_part}.md"
    
    def process_image_references(self, content: str, source_file_path: Path, 
                               target_category: str) -> str:
        """이미지 참조 처리 (TIL_IMAGE_MIGRATION_EXCEPTIONS.md 기준)"""
        source_dir = source_file_path.parent
        target_image_dir = self.target_images_dir / target_category
        target_image_dir.mkdir(parents=True, exist_ok=True)
        
        # 이미지 참조 패턴들
        patterns = [
            (r'!\[([^\]]*)\]\((\./)?(\.\./)?(img/[^)]+)\)', 'markdown'),  # ![](./img/file.png)
            (r'<img([^>]*?)src=["\']((\./)?(\.\./)?(img/[^"\']+))["\']([^>]*?)/?>', 'html')  # <img src="img/file.png">
        ]
        
        for pattern, img_type in patterns:
            def replace_image(match):
                if img_type == 'markdown':
                    alt_text = match.group(1)
                    img_path = match.group(4)  # img/filename.png
                else:  # html
                    pre_attrs = match.group(1)
                    img_path = match.group(5)  # img/filename.png
                    post_attrs = match.group(6)
                
                # 이미지 파일 경로 처리
                img_filename = img_path.replace('img/', '')
                
                # 서브폴더 구조 처리 (img/subfolder/file.png -> subfolder-file.png)
                if '/' in img_filename:
                    img_filename = img_filename.replace('/', '-')
                
                # 소스 이미지 파일 찾기
                source_img_path = None
                
                # 1. 같은 디렉토리의 img 폴더
                local_img_path = source_dir / img_path
                if local_img_path.exists():
                    source_img_path = local_img_path
                
                # 2. 상위 디렉토리의 img 폴더 (../img/ 케이스)
                if not source_img_path:
                    parent_img_path = source_dir.parent / img_path
                    if parent_img_path.exists():
                        source_img_path = parent_img_path
                
                # 3. 원본 경로에서 img/만 제거하고 찾기
                if not source_img_path:
                    direct_path = source_dir / img_path.replace('img/', '')
                    if direct_path.exists():
                        source_img_path = direct_path
                
                if source_img_path and source_img_path.exists():
                    # 타겟 이미지 경로
                    target_img_path = target_image_dir / img_filename
                    
                    # 이미지 복사
                    try:
                        shutil.copy2(source_img_path, target_img_path)
                        self.stats['images_copied'] += 1
                        logger.info(f"이미지 복사: {source_img_path} -> {target_img_path}")
                    except Exception as e:
                        logger.error(f"이미지 복사 실패: {source_img_path} -> {e}")
                
                # 새 이미지 경로
                new_img_path = f"/assets/images/posts/{target_category}/{img_filename}"
                
                # 새 마크업 생성
                if img_type == 'markdown':
                    return f"![{alt_text}]({new_img_path})"
                else:  # html
                    return f"<img{pre_attrs}src=\"{new_img_path}\"{post_attrs}>"
            
            content = re.sub(pattern, replace_image, content)
        
        return content
    
    def migrate_file(self, source_file: Path) -> bool:
        """단일 파일 마이그레이션"""
        try:
            # 제외 파일 체크
            if self.should_exclude_file(source_file):
                logger.info(f"제외: {source_file}")
                self.stats['excluded'] += 1
                return True
            
            # 파일 읽기
            with open(source_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Front Matter 파싱
            old_front_matter, body = self.parse_front_matter(content)
            
            # 카테고리 결정 (원본 front matter 우선, 없으면 경로 기반)
            category = self.get_category_from_source(source_file, old_front_matter)
            
            # 새 Front Matter 생성
            new_front_matter = self.create_new_front_matter(
                old_front_matter, source_file, source_file.name, category
            )
            
            # 새 파일명 생성
            new_filename = self.generate_new_filename(new_front_matter, source_file.name)
            
            # 이미지 처리
            processed_body = self.process_image_references(body, source_file, category)
            
            # 새 콘텐츠 생성
            new_content = "---\n"
            new_content += yaml.dump(new_front_matter, default_flow_style=False, allow_unicode=True)
            new_content += "---\n\n"
            new_content += processed_body
            
            # 타겟 파일 경로
            target_file = self.target_posts_dir / new_filename
            
            # 파일명 중복 체크 및 처리
            counter = 1
            original_target = target_file
            while target_file.exists():
                stem = original_target.stem
                suffix = original_target.suffix
                target_file = original_target.parent / f"{stem}-{counter}{suffix}"
                counter += 1
            
            # 파일 저장
            self.target_posts_dir.mkdir(parents=True, exist_ok=True)
            with open(target_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            logger.info(f"마이그레이션 완료: {source_file} -> {target_file}")
            self.stats['processed'] += 1
            return True
            
        except Exception as e:
            logger.error(f"마이그레이션 실패: {source_file} -> {e}")
            self.stats['errors'] += 1
            return False
    
    def migrate_all(self) -> Dict:
        """전체 마이그레이션 실행"""
        logger.info("TIL 마이그레이션 시작")
        
        # 소스 디렉토리 존재 확인
        if not self.source_dir.exists():
            raise FileNotFoundError(f"소스 디렉토리를 찾을 수 없습니다: {self.source_dir}")
        
        # 타겟 디렉토리 생성
        self.target_posts_dir.mkdir(parents=True, exist_ok=True)
        self.target_images_dir.mkdir(parents=True, exist_ok=True)
        
        # 모든 마크다운 파일 찾기
        md_files = list(self.source_dir.rglob("*.md"))
        logger.info(f"총 {len(md_files)}개의 마크다운 파일 발견")
        
        # 각 파일 마이그레이션
        for md_file in md_files:
            self.migrate_file(md_file)
        
        # 결과 로깅
        logger.info("마이그레이션 완료")
        logger.info(f"처리됨: {self.stats['processed']}")
        logger.info(f"제외됨: {self.stats['excluded']}")
        logger.info(f"건너뜀: {self.stats['skipped']}")
        logger.info(f"오류: {self.stats['errors']}")
        logger.info(f"이미지 복사: {self.stats['images_copied']}")
        
        return self.stats

def main():
    """메인 실행 함수"""
    try:
        migrator = TILMigration()
        result = migrator.migrate_all()
        
        print("\n" + "="*50)
        print("TIL 마이그레이션 완료!")
        print("="*50)
        print(f"✅ 성공적으로 처리된 파일: {result['processed']}")
        print(f"🚫 제외된 파일: {result['excluded']}")
        print(f"❌ 오류가 발생한 파일: {result['errors']}")
        print(f"🖼️  복사된 이미지: {result['images_copied']}")
        print("\n자세한 로그는 migration.log 파일을 확인하세요.")
        
    except Exception as e:
        logger.error(f"마이그레이션 실패: {e}")
        print(f"❌ 마이그레이션 실패: {e}")

if __name__ == "__main__":
    main()