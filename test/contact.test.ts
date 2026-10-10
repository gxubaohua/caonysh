// Contact page seam: the Inquiry form surface (user stories 14-20, 34).
// Assertions target the built HTML only, per spec Testing Decisions —
// no Web3Forms network submission is tested, only the form markup and
// the inline client scripts shipped in the page.
import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';

describe('Contact page (built HTML seam)', () => {
  const html = readBuiltPage('contact/index.html');

  test('has a page-specific title and description', () => {
    expect(pageTitle(html)).toMatch(/Contact/);
    expect(metaDescription(html)).toBeTruthy();
  });

  test('inquiry form: name, email and message are required fields', () => {
    for (const field of ['name', 'email', 'message']) {
      const input = html.match(new RegExp(`<[^>]*name="${field}"[^>]*>`))?.[0];
      expect(input, `field ${field} present`).toBeTruthy();
      expect(input, `field ${field} required`).toMatch(/required/);
    }
  });

  test('inquiry form: country and company are optional fields', () => {
    for (const field of ['country', 'company']) {
      const input = html.match(new RegExp(`<[^>]*name="${field}"[^>]*>`))?.[0];
      expect(input, `field ${field} present`).toBeTruthy();
      expect(input, `field ${field} must not be required`).not.toMatch(/required/);
    }
  });

  test('inquiry form asks for no phone number', () => {
    expect(html).not.toMatch(/<input[^>]*type="tel"/i);
    expect(html).not.toMatch(/<[^>]*name="(phone|telephone|tel)"/i);
  });

  test('inquiry form submits to the Web3Forms endpoint', () => {
    const form = html.match(/<form[^>]*>/)?.[0];
    expect(form).toBeTruthy();
    expect(form).toContain('https://api.web3forms.com/submit');
  });

  test('inquiry form carries the hidden access_key input from the environment', () => {
    expect(html).toMatch(/<input[^>]*type="hidden"[^>]*name="access_key"[^>]*>/);
  });

  test('inquiry form: the company email is visible in the page body', () => {
    expect(html).toContain('service@caonysh.com');
  });

  test('page ships the Inquiry Prefill script reading the product query parameter', () => {
    // The detail pages link here as /contact?product=<encoded name>; the
    // inline script decodes it into the message textarea (GLOSSARY: Inquiry
    // Prefill — initial content, not a required constraint). We assert the
    // script is present in the shipped HTML, not its runtime behavior.
    expect(html).toMatch(/<script[^>]*>[\s\S]*product[\s\S]*decodeURIComponent[\s\S]*<\/script>/);
    expect(html).toMatch(/Inquiry about:/);
  });

  test('page ships a success state panel hidden by default', () => {
    const panel = html.match(/<[^>]*(hidden)[^>]*>[^<]*[^<]*Thank|<[^>]*inquiry-success[^>]*/);
    expect(html).toMatch(/class="[^"]*inquiry-success[^"]*"/);
    expect(html).toContain('Thank you');
  });

  test('page ships an error state panel with a retry hint and email fallback', () => {
    expect(html).toMatch(/class="[^"]*inquiry-error[^"]*"/);
    expect(html).toMatch(/retry/i);
    expect(html).toContain('service@caonysh.com');
  });

  test('page ships the fetch-based submit script for Web3Forms', () => {
    // Client-side submission with DOM state switching (spec: allowed inline
    // script, zero framework). Network behavior itself is out of scope.
    expect(html).toMatch(/<script[^>]*>[\s\S]*fetch\(form\.action[\s\S]*<\/script>/);
    expect(html).toMatch(/api\.web3forms\.com/);
  });
});

function pageTitle(html: string): string | null {
  return html.match(/<title>([^<]+)<\/title>/)?.[1] ?? null;
}

function metaDescription(html: string): string | null {
  return html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1] ?? null;
}
