"""Scoped regression checks for the November 2026 homepage anchor migration."""
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
REVIEWS = ('cage', 'food', 'shelter', 'substrate', 'uvb-light', 'water-filter')
GUIDES = ('turtle-not-eating', 'turtle-runny-nose', 'turtle-shell-white', 'turtle-trouble-guide')
SOURCES = tuple(f'{name}-review.html' for name in REVIEWS) + ('privacy.html',) + tuple(f'guides/{name}.html' for name in GUIDES)

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids = []
        self.links = []
        self.tags = []
        self.feed((ROOT / path).read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs)

class NavigationAnchorRoutes(unittest.TestCase):
    def test_scoped_internal_destinations_and_fragments_exist(self):
        for source in SOURCES:
            for link in Page(source).links:
                dest = urlsplit(urljoin('https://kamelifeguide.com/' + source, link['href']))
                if dest.netloc != 'kamelifeguide.com':
                    continue
                path = unquote(dest.path).lstrip('/') or 'index.html'
                if path.endswith('/'):
                    path += 'index.html'
                with self.subTest(source=source, href=link['href']):
                    self.assertTrue((ROOT / path).is_file(), path)
                    if dest.fragment:
                        self.assertIn(unquote(dest.fragment), Page(path).ids)

    def test_removed_home_fragments_not_reintroduced(self):
        for source in SOURCES:
            for link in Page(source).links:
                dest = urlsplit(urljoin('https://kamelifeguide.com/' + source, link['href']))
                if dest.path in ('/', '/index.html'):
                    self.assertNotIn(dest.fragment, ('articles', 'ranking', 'cost-sim', 'guide-links'), source)

    def test_equipment_links_keep_exact_target_and_tracking(self):
        count = 0
        for name in GUIDES:
            for link in Page(f'guides/{name}.html').links:
                if link['href'] == '../index.html#top-gear-picks':
                    count += 1
        self.assertEqual(count, 7)
        home = Page('index.html')
        self.assertEqual(home.ids.count('top-gear-picks'), 1)
        self.assertIn(('h3', {'class': 'ch-subhead', 'id': 'top-gear-picks'}), home.tags)
        self.assertIn('id="top-gear-picks">環境を整えるための、定番機材</h3>', (ROOT / 'index.html').read_text(encoding='utf-8'))

    def test_reviews_and_privacy_link_to_real_indexes(self):
        for source in tuple(f'{name}-review.html' for name in REVIEWS) + ('privacy.html',):
            links = [a['href'] for a in Page(source).links]
            self.assertIn('guides/', links, source)
            self.assertIn('ranking-beginner-top10.html', links, source)
        links = [a['href'] for a in Page('guides/turtle-trouble-guide.html').links]
        self.assertIn('../guides/', links)
        self.assertIn('../index.html#before-you-keep', links)
        self.assertIn('before-you-keep', Page('index.html').ids)

if __name__ == '__main__':
    unittest.main()
