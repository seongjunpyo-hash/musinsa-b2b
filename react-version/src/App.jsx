import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';


        // MOCK DATA
        const PARTNERS = [
            { partner_id: 'PTR-001', company_name: 'Southeast Asia Trading Co.', email: 'partner@sea-trading.com', discount_rate: 0.30, created_at: '2024-01-15' },
            { partner_id: 'PTR-002', company_name: 'Middle East Fashion Hub', email: 'orders@me-fashion.com', discount_rate: 0.25, created_at: '2024-02-20' },
            { partner_id: 'PTR-003', company_name: 'Singapore Style Partners', email: 'buying@sg-style.com', discount_rate: 0.28, created_at: '2024-03-10' }
        ];

        const EXCHANGE_RATE = 1350.00;
        const CURRENT_PARTNER = PARTNERS[0];

        const PRODUCTS = [
            { id: 'P-001', style_no: 'MSSTD-JK01', name: 'Light Windbreaker Jacket', colors: [{ name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145764190_big-NtsQcEgdrQjvBOGpQvPQ4JPRbAUNw9.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3732808_17008145386635_big-e8tW9vvDFk3LSBkYqJUbwe0wi4MYfZ.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145754168_big-pDpq99fUbWRi2IMAlNRJk8rfg6SOnl.webp'] }, { name: 'NAVY', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145764190_big-NtsQcEgdrQjvBOGpQvPQ4JPRbAUNw9.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3732808_17008145386635_big-e8tW9vvDFk3LSBkYqJUbwe0wi4MYfZ.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145754168_big-pDpq99fUbWRi2IMAlNRJk8rfg6SOnl.webp'] }, { name: 'GREY', hex: '#808080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145764190_big-NtsQcEgdrQjvBOGpQvPQ4JPRbAUNw9.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3732808_17008145386635_big-e8tW9vvDFk3LSBkYqJUbwe0wi4MYfZ.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145754168_big-pDpq99fUbWRi2IMAlNRJk8rfg6SOnl.webp'] }], material: 'Nylon 100%', origin: 'Vietnam', category: 'Outerwear', sub_category: 'Windbreaker', retail_price_krw: 89000, sample_size: 'M', hs_code: '6201.93', ship_date: '2026-10-15', is_visible: true, is_hero: true, season: { year: 2026, season: 'F/W' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145764190_big-NtsQcEgdrQjvBOGpQvPQ4JPRbAUNw9.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3732808_17008145386635_big-e8tW9vvDFk3LSBkYqJUbwe0wi4MYfZ.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145754168_big-pDpq99fUbWRi2IMAlNRJk8rfg6SOnl.webp'], sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
            { id: 'P-002', style_no: 'DENIM-SH02', name: 'Classic Denim Shirt', colors: [{ name: 'INDIGO', hex: '#4B0082', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281298325_big-IBH1zefp09enMqo0kzf0TU3qK69786.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281454244_big-rzeDLkm3PuJb1Ux90iwxYMLbIyixAt.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp'] }, { name: 'LIGHT BLUE', hex: '#ADD8E6', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281298325_big-IBH1zefp09enMqo0kzf0TU3qK69786.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281454244_big-rzeDLkm3PuJb1Ux90iwxYMLbIyixAt.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp'] }, { name: 'WHITE', hex: '#FFFFFF', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281298325_big-IBH1zefp09enMqo0kzf0TU3qK69786.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281454244_big-rzeDLkm3PuJb1Ux90iwxYMLbIyixAt.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp'] }], material: 'Cotton 98% Elastane 2%', origin: 'Bangladesh', category: 'Tops', sub_category: 'Shirt', retail_price_krw: 65000, sample_size: 'M', hs_code: '6205.20', ship_date: '2026-09-20', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281298325_big-IBH1zefp09enMqo0kzf0TU3qK69786.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281454244_big-rzeDLkm3PuJb1Ux90iwxYMLbIyixAt.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp'], sizes: ['S', 'M', 'L', 'XL'] },
            { id: 'P-003', style_no: 'TSHIRT-BAS03', name: 'Essential White T-Shirt', colors: [{ name: 'WHITE', hex: '#FFFFFF', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3732808_17008145386635_big-e8tW9vvDFk3LSBkYqJUbwe0wi4MYfZ.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145754168_big-pDpq99fUbWRi2IMAlNRJk8rfg6SOnl.webp'] }, { name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3732808_17008145386635_big-e8tW9vvDFk3LSBkYqJUbwe0wi4MYfZ.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145754168_big-pDpq99fUbWRi2IMAlNRJk8rfg6SOnl.webp'] }, { name: 'GREY', hex: '#808080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3732808_17008145386635_big-e8tW9vvDFk3LSBkYqJUbwe0wi4MYfZ.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145754168_big-pDpq99fUbWRi2IMAlNRJk8rfg6SOnl.webp'] }], material: 'Cotton 100%', origin: 'India', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 28000, sample_size: 'M', hs_code: '6104.62', ship_date: '2026-08-15', is_visible: true, is_hero: false, season: { year: 2025, season: 'S/S' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3732808_17008145386635_big-e8tW9vvDFk3LSBkYqJUbwe0wi4MYfZ.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_3732808_17008145754168_big-pDpq99fUbWRi2IMAlNRJk8rfg6SOnl.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-004', style_no: 'SWEAT-GRY04', name: 'Comfort Grey Sweatshirt', colors: [{ name: 'GREY', hex: '#808080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4690282_17484120633015_big-d05xAPoZRJ3pH0bhzfghMHp8MTg2Ur.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281544256_big-xMyZCynBr1G90pKE6VKkejEepNPRZ5.webp'] }, { name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4690282_17484120633015_big-d05xAPoZRJ3pH0bhzfghMHp8MTg2Ur.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281544256_big-xMyZCynBr1G90pKE6VKkejEepNPRZ5.webp'] }, { name: 'NAVY', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4690282_17484120633015_big-d05xAPoZRJ3pH0bhzfghMHp8MTg2Ur.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281544256_big-xMyZCynBr1G90pKE6VKkejEepNPRZ5.webp'] }], material: 'Cotton 60% Polyester 40%', origin: 'Vietnam', category: 'Tops', sub_category: 'Sweatshirt', retail_price_krw: 52000, sample_size: 'M', hs_code: '6104.69', ship_date: '2026-09-10', is_visible: true, is_hero: true, season: { year: 2026, season: 'F/W' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4690282_17484120633015_big-d05xAPoZRJ3pH0bhzfghMHp8MTg2Ur.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281544256_big-xMyZCynBr1G90pKE6VKkejEepNPRZ5.webp'], sizes: ['S', 'M', 'L'] },
            { id: 'P-005', style_no: 'SHIRT-GRN05', name: 'Premium Green Shirt', colors: [{ name: 'FOREST GREEN', hex: '#228B22', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281454244_big-rzeDLkm3PuJb1Ux90iwxYMLbIyixAt.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281359421_big-vjFydy5ONXI8qrIItmbaZ5JIXiBSMs.webp'] }, { name: 'SAGE GREEN', hex: '#9DC183', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281454244_big-rzeDLkm3PuJb1Ux90iwxYMLbIyixAt.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281359421_big-vjFydy5ONXI8qrIItmbaZ5JIXiBSMs.webp'] }, { name: 'OLIVE', hex: '#808000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281454244_big-rzeDLkm3PuJb1Ux90iwxYMLbIyixAt.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281359421_big-vjFydy5ONXI8qrIItmbaZ5JIXiBSMs.webp'] }], material: 'Cotton 100%', origin: 'Pakistan', category: 'Tops', sub_category: 'Shirt', retail_price_krw: 58000, sample_size: 'M', hs_code: '6205.20', ship_date: '2026-10-01', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281454244_big-rzeDLkm3PuJb1Ux90iwxYMLbIyixAt.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281359421_big-vjFydy5ONXI8qrIItmbaZ5JIXiBSMs.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-006', style_no: 'PUFFER-BLK06', name: 'Classic Black Puffer Jacket', colors: [{ name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5064198_17478992801556_big%20%281%29-aiZZ8H5qL6ekOkEkvgYTMDr9GSQEiS.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5064198_17478992801556_big-mi1fT07dNIBJ1DDfozAl4pqPeUOWyK.webp'] }, { name: 'NAVY', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5064198_17478992801556_big%20%281%29-aiZZ8H5qL6ekOkEkvgYTMDr9GSQEiS.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5064198_17478992801556_big-mi1fT07dNIBJ1DDfozAl4pqPeUOWyK.webp'] }, { name: 'CHARCOAL', hex: '#333333', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5064198_17478992801556_big%20%281%29-aiZZ8H5qL6ekOkEkvgYTMDr9GSQEiS.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5064198_17478992801556_big-mi1fT07dNIBJ1DDfozAl4pqPeUOWyK.webp'] }], material: 'Polyester 100%', origin: 'China', category: 'Outerwear', sub_category: 'Puffer', retail_price_krw: 125000, sample_size: 'M', hs_code: '6201.13', ship_date: '2026-11-05', is_visible: true, is_hero: true, season: { year: 2026, season: 'F/W' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5064198_17478992801556_big%20%281%29-aiZZ8H5qL6ekOkEkvgYTMDr9GSQEiS.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5064198_17478992801556_big-mi1fT07dNIBJ1DDfozAl4pqPeUOWyK.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
            { id: 'P-007', style_no: 'WINDBRK-NAVY07', name: 'Colorblock Windbreaker', colors: [{ name: 'NAVY/CREAM', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5898080_17733033213649_big-JGdwFcTn4Wdkvn7zOZiwnb5i6DDEV7.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d0ca5ffbdfde4c2f981b0027d419a0a4-YszwHw5v9qhNSGkmkJLzjlY5zmsCF7.webp'] }, { name: 'BLACK/CREAM', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5898080_17733033213649_big-JGdwFcTn4Wdkvn7zOZiwnb5i6DDEV7.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d0ca5ffbdfde4c2f981b0027d419a0a4-YszwHw5v9qhNSGkmkJLzjlY5zmsCF7.webp'] }, { name: 'GREY/CREAM', hex: '#808080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5898080_17733033213649_big-JGdwFcTn4Wdkvn7zOZiwnb5i6DDEV7.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d0ca5ffbdfde4c2f981b0027d419a0a4-YszwHw5v9qhNSGkmkJLzjlY5zmsCF7.webp'] }], material: 'Nylon 100%', origin: 'Indonesia', category: 'Outerwear', sub_category: 'Windbreaker', retail_price_krw: 95000, sample_size: 'M', hs_code: '6201.93', ship_date: '2026-10-20', is_visible: true, is_hero: true, season: { year: 2026, season: 'F/W' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5898080_17733033213649_big-JGdwFcTn4Wdkvn7zOZiwnb5i6DDEV7.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d0ca5ffbdfde4c2f981b0027d419a0a4-YszwHw5v9qhNSGkmkJLzjlY5zmsCF7.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-008', style_no: 'SHIRT-LT-BLU08', name: 'Light Blue Oxford Shirt', colors: [{ name: 'LIGHT BLUE', hex: '#ADD8E6', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281163133_big-cBwU3UgnQ1QNoab8uS0SdkOt27CSjg.webp'] }, { name: 'WHITE', hex: '#FFFFFF', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281163133_big-cBwU3UgnQ1QNoab8uS0SdkOt27CSjg.webp'] }, { name: 'PINK', hex: '#FFC0CB', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281163133_big-cBwU3UgnQ1QNoab8uS0SdkOt27CSjg.webp'] }], material: 'Cotton 100%', origin: 'Philippines', category: 'Tops', sub_category: 'Shirt', retail_price_krw: 62000, sample_size: 'M', hs_code: '6205.20', ship_date: '2026-09-25', is_visible: true, is_hero: false, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281163133_big-cBwU3UgnQ1QNoab8uS0SdkOt27CSjg.webp'], sizes: ['S', 'M', 'L', 'XL'] },
            { id: 'P-009', style_no: 'SWEATER-PINK09', name: 'Soft Pink Crewneck Sweater', colors: [{ name: 'PINK', hex: '#FFC0CB', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5987750_17703411181399_big-TVjVOooktKSj6lcwBDU8PTQIHXMOet.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4690282_17484120633015_big-d05xAPoZRJ3pH0bhzfghMHp8MTg2Ur.webp'] }, { name: 'CREAM', hex: '#FFFDD0', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5987750_17703411181399_big-TVjVOooktKSj6lcwBDU8PTQIHXMOet.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4690282_17484120633015_big-d05xAPoZRJ3pH0bhzfghMHp8MTg2Ur.webp'] }, { name: 'BEIGE', hex: '#F5F5DC', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5987750_17703411181399_big-TVjVOooktKSj6lcwBDU8PTQIHXMOet.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4690282_17484120633015_big-d05xAPoZRJ3pH0bhzfghMHp8MTg2Ur.webp'] }], material: 'Cotton 65% Acrylic 35%', origin: 'Vietnam', category: 'Tops', sub_category: 'Knit', retail_price_krw: 71000, sample_size: 'M', hs_code: '6110.30', ship_date: '2026-10-10', is_visible: true, is_hero: true, season: { year: 0, season: 'Carry Over' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5987750_17703411181399_big-TVjVOooktKSj6lcwBDU8PTQIHXMOet.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4690282_17484120633015_big-d05xAPoZRJ3pH0bhzfghMHp8MTg2Ur.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-010', style_no: 'SHIRT-SAGE10', name: 'Versatile Sage Green Shirt', colors: [{ name: 'SAGE GREEN', hex: '#9DC183', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281544256_big-xMyZCynBr1G90pKE6VKkejEepNPRZ5.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281359421_big-vjFydy5ONXI8qrIItmbaZ5JIXiBSMs.webp'] }, { name: 'FOREST GREEN', hex: '#228B22', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281544256_big-xMyZCynBr1G90pKE6VKkejEepNPRZ5.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281359421_big-vjFydy5ONXI8qrIItmbaZ5JIXiBSMs.webp'] }, { name: 'OLIVE', hex: '#808000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281544256_big-xMyZCynBr1G90pKE6VKkejEepNPRZ5.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281359421_big-vjFydy5ONXI8qrIItmbaZ5JIXiBSMs.webp'] }], material: 'Cotton 100%', origin: 'Pakistan', category: 'Tops', sub_category: 'Shirt', retail_price_krw: 59000, sample_size: 'M', hs_code: '6205.20', ship_date: '2026-09-30', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281544256_big-xMyZCynBr1G90pKE6VKkejEepNPRZ5.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281359421_big-vjFydy5ONXI8qrIItmbaZ5JIXiBSMs.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },

            { id: 'P-012', style_no: 'SWEAT-NAVY-GRX12', name: 'Nature Graphic Navy Sweatshirt', colors: [{ name: 'NAVY', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5987750_17703454876061_big-2maj0MGTTvIXp8ra2G2CPSm7u6uVmR.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4690282_17356409407162_big-vYVL05HLts88UViUn62wT4hnaHzPiw.webp'] }, { name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5987750_17703454876061_big-2maj0MGTTvIXp8ra2G2CPSm7u6uVmR.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4690282_17356409407162_big-vYVL05HLts88UViUn62wT4hnaHzPiw.webp'] }, { name: 'CHARCOAL', hex: '#333333', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5987750_17703454876061_big-2maj0MGTTvIXp8ra2G2CPSm7u6uVmR.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4690282_17356409407162_big-vYVL05HLts88UViUn62wT4hnaHzPiw.webp'] }], material: 'Cotton 80% Polyester 20%', origin: 'Vietnam', category: 'Tops', sub_category: 'Sweatshirt', retail_price_krw: 64000, sample_size: 'M', hs_code: '6104.69', ship_date: '2026-10-12', is_visible: true, is_hero: false, season: { year: 0, season: 'Carry Over' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5987750_17703454876061_big-2maj0MGTTvIXp8ra2G2CPSm7u6uVmR.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4690282_17356409407162_big-vYVL05HLts88UViUn62wT4hnaHzPiw.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },

            { id: 'P-014', style_no: 'JACKET-DRK14', name: 'Charcoal Hooded Windbreaker', colors: [{ name: 'DARK GREY', hex: '#A9A9A9', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281785095_big-GhA3ZegEuNLePn5nfMc2qSTkSNWPpd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5064198_17478992971594_big-2CnKxm8kgAEWF2AoZlLn99s3xhxSJ8.webp'] }, { name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281785095_big-GhA3ZegEuNLePn5nfMc2qSTkSNWPpd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5064198_17478992971594_big-2CnKxm8kgAEWF2AoZlLn99s3xhxSJ8.webp'] }, { name: 'NAVY', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281785095_big-GhA3ZegEuNLePn5nfMc2qSTkSNWPpd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5064198_17478992971594_big-2CnKxm8kgAEWF2AoZlLn99s3xhxSJ8.webp'] }], material: 'Nylon 100%', origin: 'China', category: 'Outerwear', sub_category: 'Jacket', retail_price_krw: 110000, sample_size: 'M', hs_code: '6201.93', ship_date: '2026-11-01', is_visible: true, is_hero: false, season: { year: 2026, season: 'F/W' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281785095_big-GhA3ZegEuNLePn5nfMc2qSTkSNWPpd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5064198_17478992971594_big-2CnKxm8kgAEWF2AoZlLn99s3xhxSJ8.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-015', style_no: 'ANORAK-NAVY15', name: 'Navy Colorblock Anorak', colors: [{ name: 'NAVY/CREAM', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5987750_17703454886254_big-4195faq6mef8u8Mu2szCwUn9d4aJnP.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5898080_17733033317629_big-Hjoe6V215bsC3dEV9PSMybK1CBfAQi.webp'] }, { name: 'BLACK/CREAM', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5987750_17703454886254_big-4195faq6mef8u8Mu2szCwUn9d4aJnP.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5898080_17733033317629_big-Hjoe6V215bsC3dEV9PSMybK1CBfAQi.webp'] }, { name: 'GREY/CREAM', hex: '#808080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5987750_17703454886254_big-4195faq6mef8u8Mu2szCwUn9d4aJnP.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5898080_17733033317629_big-Hjoe6V215bsC3dEV9PSMybK1CBfAQi.webp'] }], material: 'Nylon 100%', origin: 'Vietnam', category: 'Outerwear', sub_category: 'Windbreaker', retail_price_krw: 105000, sample_size: 'M', hs_code: '6201.93', ship_date: '2026-10-28', is_visible: true, is_hero: true, season: { year: 2026, season: 'F/W' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5987750_17703454886254_big-4195faq6mef8u8Mu2szCwUn9d4aJnP.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5898080_17733033317629_big-Hjoe6V215bsC3dEV9PSMybK1CBfAQi.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-016', style_no: 'HOOD-RIB16', name: 'Ribbed Sleeve Hooded Jacket', colors: [{ name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6012200_17725043883314_big-evDHsGjCXFcaFAf96LHFqIYUlu3UQd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17725043956515_big-vfAlxCJQqWKKn02SvAjdvoAYhZNYrd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695459931_big-ODcFxnSBvfW5T0lTCSdZaMktGLFsjn.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17719221219882_big-kXOziotEWzfwFORcAmaZlU9w0nTFw2.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695467257_big-YjDaO0r4Fw8NkXCHawG9qo5UeERKIg.webp'] }, { name: 'NAVY', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6012200_17725043883314_big-evDHsGjCXFcaFAf96LHFqIYUlu3UQd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17725043956515_big-vfAlxCJQqWKKn02SvAjdvoAYhZNYrd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695459931_big-ODcFxnSBvfW5T0lTCSdZaMktGLFsjn.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17719221219882_big-kXOziotEWzfwFORcAmaZlU9w0nTFw2.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695467257_big-YjDaO0r4Fw8NkXCHawG9qo5UeERKIg.webp'] }, { name: 'CHARCOAL', hex: '#333333', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6012200_17725043883314_big-evDHsGjCXFcaFAf96LHFqIYUlu3UQd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17725043956515_big-vfAlxCJQqWKKn02SvAjdvoAYhZNYrd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695459931_big-ODcFxnSBvfW5T0lTCSdZaMktGLFsjn.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17719221219882_big-kXOziotEWzfwFORcAmaZlU9w0nTFw2.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695467257_big-YjDaO0r4Fw8NkXCHawG9qo5UeERKIg.webp'] }], material: 'Nylon 70% Cotton 30%', origin: 'Korea', category: 'Outerwear', sub_category: 'Jacket', retail_price_krw: 139000, sample_size: 'M', hs_code: '6201.93', ship_date: '2026-11-10', is_visible: true, is_hero: true, season: { year: 0, season: 'Carry Over' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6012200_17725043883314_big-evDHsGjCXFcaFAf96LHFqIYUlu3UQd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17725043956515_big-vfAlxCJQqWKKn02SvAjdvoAYhZNYrd.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695459931_big-ODcFxnSBvfW5T0lTCSdZaMktGLFsjn.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17719221219882_big-kXOziotEWzfwFORcAmaZlU9w0nTFw2.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695467257_big-YjDaO0r4Fw8NkXCHawG9qo5UeERKIg.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-017', style_no: 'BOMBER-SHINY17', name: 'Glossy Black Bomber Jacket', colors: [{ name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5318903_17555112033548_big-BJ5ZmfIJ1AcfdFA89xoCfHEEm6lj64.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575088709_big-Trz5aiNLmoylB48WAlw78OzlbvqluN.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575060433_big-5VLfsylZrEFriwDCkOW0S6mXbofUmw.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575118739_big-4MDBPx772QsYLPVj8ivM7k70kpR6nL.webp'] }, { name: 'NAVY', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5318903_17555112033548_big-BJ5ZmfIJ1AcfdFA89xoCfHEEm6lj64.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575088709_big-Trz5aiNLmoylB48WAlw78OzlbvqluN.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575060433_big-5VLfsylZrEFriwDCkOW0S6mXbofUmw.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575118739_big-4MDBPx772QsYLPVj8ivM7k70kpR6nL.webp'] }, { name: 'CHARCOAL', hex: '#333333', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5318903_17555112033548_big-BJ5ZmfIJ1AcfdFA89xoCfHEEm6lj64.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575088709_big-Trz5aiNLmoylB48WAlw78OzlbvqluN.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575060433_big-5VLfsylZrEFriwDCkOW0S6mXbofUmw.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575118739_big-4MDBPx772QsYLPVj8ivM7k70kpR6nL.webp'] }], material: 'Polyester 100%', origin: 'Korea', category: 'Outerwear', sub_category: 'Bomber', retail_price_krw: 159000, sample_size: 'M', hs_code: '6201.93', ship_date: '2026-11-15', is_visible: true, is_hero: false, season: { year: 2026, season: 'Special' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5318903_17555112033548_big-BJ5ZmfIJ1AcfdFA89xoCfHEEm6lj64.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575088709_big-Trz5aiNLmoylB48WAlw78OzlbvqluN.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575060433_big-5VLfsylZrEFriwDCkOW0S6mXbofUmw.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5318903_17550575118739_big-4MDBPx772QsYLPVj8ivM7k70kpR6nL.webp'], sizes: ['S', 'M', 'L', 'XL'] },
            { id: 'P-018', style_no: 'TECH-NAVY18', name: 'Navy Tech Mountain Jacket', colors: [{ name: 'NAVY/BLACK', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5408723_17707909468751_big-ZyVIFYpHO0UkoYxXo1hs5lauTxOEqr.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5408723_17707909496047_big-T5J8eorC3daZyhw0ZS1yrbPUgXXhee.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5408723_17707909508028_big-gppdnKtcn8XlQYgllNc6fhPrlAUFVh.webp'] }, { name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5408723_17707909468751_big-ZyVIFYpHO0UkoYxXo1hs5lauTxOEqr.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5408723_17707909496047_big-T5J8eorC3daZyhw0ZS1yrbPUgXXhee.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5408723_17707909508028_big-gppdnKtcn8XlQYgllNc6fhPrlAUFVh.webp'] }, { name: 'CHARCOAL', hex: '#333333', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5408723_17707909468751_big-ZyVIFYpHO0UkoYxXo1hs5lauTxOEqr.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5408723_17707909496047_big-T5J8eorC3daZyhw0ZS1yrbPUgXXhee.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5408723_17707909508028_big-gppdnKtcn8XlQYgllNc6fhPrlAUFVh.webp'] }], material: 'Nylon 100%', origin: 'Vietnam', category: 'Outerwear', sub_category: 'Jacket', retail_price_krw: 189000, sample_size: 'L', hs_code: '6201.93', ship_date: '2026-11-20', is_visible: true, is_hero: false, season: { year: 2026, season: 'F/W' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5408723_17707909468751_big-ZyVIFYpHO0UkoYxXo1hs5lauTxOEqr.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5408723_17707909496047_big-T5J8eorC3daZyhw0ZS1yrbPUgXXhee.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_5408723_17707909508028_big-gppdnKtcn8XlQYgllNc6fhPrlAUFVh.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-019', style_no: 'HOOD-RIB19', name: 'Ribbed Sleeve Street Jacket', colors: [{ name: 'BLACK', hex: '#000000', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17719221219882_big-kXOziotEWzfwFORcAmaZlU9w0nTFw2.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695459931_big-ODcFxnSBvfW5T0lTCSdZaMktGLFsjn.webp'] }, { name: 'NAVY', hex: '#000080', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17719221219882_big-kXOziotEWzfwFORcAmaZlU9w0nTFw2.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695459931_big-ODcFxnSBvfW5T0lTCSdZaMktGLFsjn.webp'] }, { name: 'CHARCOAL', hex: '#333333', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17719221219882_big-kXOziotEWzfwFORcAmaZlU9w0nTFw2.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695459931_big-ODcFxnSBvfW5T0lTCSdZaMktGLFsjn.webp'] }], material: 'Nylon 70% Cotton 30%', origin: 'Korea', category: 'Outerwear', sub_category: 'Jacket', retail_price_krw: 145000, sample_size: 'M', hs_code: '6201.93', ship_date: '2026-11-12', is_visible: true, is_hero: false, season: { year: 0, season: 'Carry Over' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17719221219882_big-kXOziotEWzfwFORcAmaZlU9w0nTFw2.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_6012200_17721695459931_big-ODcFxnSBvfW5T0lTCSdZaMktGLFsjn.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-020', style_no: 'LINEN-WHT20', name: 'Relaxed Linen Blend Shirt', colors: [{ name: 'WHITE', hex: '#FFFFFF', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281163133_big-cBwU3UgnQ1QNoab8uS0SdkOt27CSjg.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp'] }, { name: 'BEIGE', hex: '#F5F5DC', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281163133_big-cBwU3UgnQ1QNoab8uS0SdkOt27CSjg.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp'] }, { name: 'LIGHT BLUE', hex: '#ADD8E6', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281163133_big-cBwU3UgnQ1QNoab8uS0SdkOt27CSjg.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp'] }], material: 'Linen 55% Cotton 45%', origin: 'Philippines', category: 'Tops', sub_category: 'Shirt', retail_price_krw: 68000, sample_size: 'M', hs_code: '6205.20', ship_date: '2027-03-15', is_visible: true, is_hero: false, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281163133_big-cBwU3UgnQ1QNoab8uS0SdkOt27CSjg.webp','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/detail_4300078_17229281015339_big-3Ip8wBdWeqGbEkw35kqi07I2BAsgid.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-021', style_no: 'KNIT-MOHAIR21', name: 'Striped Mohair Blend Sweater', colors: [{ name: 'GREY/PURPLE', hex: '#808080', images: ['/images/img_00.webp'] }, { name: 'CREAM/NAVY', hex: '#FFFDD0', images: ['/images/img_00.webp'] }, { name: 'BLACK/GREY', hex: '#000000', images: ['/images/img_00.webp'] }], material: 'Mohair 45% Wool 30% Nylon 25%', origin: 'Korea', category: 'Tops', sub_category: 'Knit', retail_price_krw: 128000, sample_size: 'M', hs_code: '6110.19', ship_date: '2027-02-15', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['/images/img_00.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-022', style_no: 'HOOD-KNITSLV22', name: 'Knit-Sleeve Hooded Zip Jacket', colors: [{ name: 'BLACK', hex: '#000000', images: ['/images/img_02.webp','/images/img_04.webp','/images/img_01.webp','/images/img_03.webp'] }, { name: 'CHARCOAL', hex: '#333333', images: ['/images/img_02.webp','/images/img_04.webp','/images/img_01.webp','/images/img_03.webp'] }, { name: 'NAVY', hex: '#000080', images: ['/images/img_02.webp','/images/img_04.webp','/images/img_01.webp','/images/img_03.webp'] }], material: 'Nylon 60% Cotton 40%', origin: 'Korea', category: 'Outerwear', sub_category: 'Jacket', retail_price_krw: 158000, sample_size: 'M', hs_code: '6201.93', ship_date: '2027-02-20', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['/images/img_02.webp','/images/img_04.webp','/images/img_01.webp','/images/img_03.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-023', style_no: 'SUEDE-BRN23', name: 'Buckle Collar Suede Zip Jacket', colors: [{ name: 'BROWN', hex: '#8B4513', images: ['/images/img_06.webp','/images/img_07.webp','/images/img_05.webp','/images/img_11.webp','/images/img_12.webp','/images/img_13.webp','/images/img_09.webp','/images/img_08.webp'] }, { name: 'BLACK', hex: '#000000', images: ['/images/img_06.webp','/images/img_07.webp','/images/img_05.webp','/images/img_11.webp','/images/img_12.webp','/images/img_13.webp','/images/img_09.webp','/images/img_08.webp'] }, { name: 'CAMEL', hex: '#C19A6B', images: ['/images/img_06.webp','/images/img_07.webp','/images/img_05.webp','/images/img_11.webp','/images/img_12.webp','/images/img_13.webp','/images/img_09.webp','/images/img_08.webp'] }], material: 'Polyester 85% Polyurethane 15%', origin: 'Korea', category: 'Outerwear', sub_category: 'Jacket', retail_price_krw: 178000, sample_size: 'M', hs_code: '6201.93', ship_date: '2027-02-25', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['/images/img_06.webp','/images/img_07.webp','/images/img_05.webp','/images/img_11.webp','/images/img_12.webp','/images/img_13.webp','/images/img_09.webp','/images/img_08.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-024', style_no: 'BLOUSON-DRK24', name: 'Minimal Zip-Up Blouson Jacket', colors: [{ name: 'CHARCOAL', hex: '#333333', images: ['/images/img_14.webp','/images/img_15.webp','/images/img_16.webp'] }, { name: 'BLACK', hex: '#000000', images: ['/images/img_14.webp','/images/img_15.webp','/images/img_16.webp'] }, { name: 'NAVY', hex: '#000080', images: ['/images/img_14.webp','/images/img_15.webp','/images/img_16.webp'] }], material: 'Nylon 100%', origin: 'Korea', category: 'Outerwear', sub_category: 'Blouson', retail_price_krw: 135000, sample_size: 'M', hs_code: '6201.93', ship_date: '2027-03-01', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['/images/img_14.webp','/images/img_15.webp','/images/img_16.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },

            // --- FEMALE ---
            { id: 'P-025', style_no: 'W-TEE-CHR25', name: 'Soft Charcoal Essential Tee', colors: [{ name: 'CHARCOAL', hex: '#3b3b3b', images: ['/images/1424102_17483290097157_big.webp','/images/detail_1424102_17483288158482_big.webp','/images/detail_1424102_17483290204701_big.webp','/images/detail_1424102_2_big.webp','/images/detail_1424102_3_big.webp','/images/detail_1424102_4_big.webp'] }, { name: 'BLACK', hex: '#000000', images: ['/images/1424102_17483290097157_big.webp','/images/detail_1424102_17483288158482_big.webp','/images/detail_1424102_17483290204701_big.webp','/images/detail_1424102_2_big.webp','/images/detail_1424102_3_big.webp','/images/detail_1424102_4_big.webp'] }, { name: 'IVORY', hex: '#F5F0E1', images: ['/images/1424102_17483290097157_big.webp','/images/detail_1424102_17483288158482_big.webp','/images/detail_1424102_17483290204701_big.webp','/images/detail_1424102_2_big.webp','/images/detail_1424102_3_big.webp','/images/detail_1424102_4_big.webp'] }], material: 'Cotton 100%', origin: 'Vietnam', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 32000, sample_size: 'S', hs_code: '6109.10', ship_date: '2027-02-28', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Female', images: ['/images/1424102_17483290097157_big.webp','/images/detail_1424102_17483288158482_big.webp','/images/detail_1424102_17483290204701_big.webp','/images/detail_1424102_2_big.webp','/images/detail_1424102_3_big.webp','/images/detail_1424102_4_big.webp'], sizes: ['XS', 'S', 'M', 'L'] },
            { id: 'P-026', style_no: 'W-TEE-CRP26', name: 'Compact Cropped Cotton Tee', colors: [{ name: 'BLACK', hex: '#000000', images: ['/images/2341387_17484972517194_big.webp','/images/detail_2341387_17484972576530_big.webp','/images/detail_2341387_17484972584669_big.webp','/images/detail_2341387_1_big.webp','/images/detail_2341387_2_big.webp','/images/detail_2341387_4_big.webp','/images/detail_2341387_7_big.webp'] }, { name: 'WHITE', hex: '#FFFFFF', images: ['/images/2341387_17484972517194_big.webp','/images/detail_2341387_17484972576530_big.webp','/images/detail_2341387_17484972584669_big.webp','/images/detail_2341387_1_big.webp','/images/detail_2341387_2_big.webp','/images/detail_2341387_4_big.webp','/images/detail_2341387_7_big.webp'] }, { name: 'PINK', hex: '#FFB6C1', images: ['/images/2341387_17484972517194_big.webp','/images/detail_2341387_17484972576530_big.webp','/images/detail_2341387_17484972584669_big.webp','/images/detail_2341387_1_big.webp','/images/detail_2341387_2_big.webp','/images/detail_2341387_4_big.webp','/images/detail_2341387_7_big.webp'] }], material: 'Cotton 95% Elastane 5%', origin: 'Korea', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 36000, sample_size: 'S', hs_code: '6109.10', ship_date: '2027-02-25', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Female', images: ['/images/2341387_17484972517194_big.webp','/images/detail_2341387_17484972576530_big.webp','/images/detail_2341387_17484972584669_big.webp','/images/detail_2341387_1_big.webp','/images/detail_2341387_2_big.webp','/images/detail_2341387_4_big.webp','/images/detail_2341387_7_big.webp'], sizes: ['XS', 'S', 'M', 'L'] },
            { id: 'P-027', style_no: 'W-TEE-SLM27', name: 'Slim Fit Black Baby Tee', colors: [{ name: 'BLACK', hex: '#000000', images: ['/images/3753636_17490155652673_big.webp','/images/detail_3753636_17128991689420_big.webp','/images/detail_3753636_17128991722673_big.webp','/images/detail_3753636_17128991756165_big.webp','/images/detail_3753636_17490155886954_big.webp','/images/detail_3753636_17490161007642_big.webp'] }, { name: 'WHITE', hex: '#FFFFFF', images: ['/images/3753636_17490155652673_big%20%281%29.webp','/images/detail_3753636_17128991689420_big%20%281%29.webp','/images/detail_3753636_17128991722673_big%20%281%29.webp','/images/detail_3753636_17128991756165_big%20%281%29.webp','/images/detail_3753636_17490155886954_big%20%281%29.webp','/images/detail_3753636_17490161007642_big%20%281%29.webp'] }, { name: 'GREY', hex: '#808080', images: ['/images/3753636_17490155652673_big.webp','/images/detail_3753636_17128991689420_big.webp','/images/detail_3753636_17128991722673_big.webp'] }], material: 'Cotton 92% Elastane 8%', origin: 'Korea', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 34000, sample_size: 'S', hs_code: '6109.10', ship_date: '2027-03-05', is_visible: true, is_hero: false, season: { year: 2027, season: 'S/S' }, gender: 'Female', images: ['/images/3753636_17490155652673_big.webp','/images/detail_3753636_17128991689420_big.webp','/images/detail_3753636_17128991722673_big.webp','/images/detail_3753636_17128991756165_big.webp','/images/detail_3753636_17490155886954_big.webp','/images/detail_3753636_17490161007642_big.webp'], sizes: ['XS', 'S', 'M', 'L'] },
            { id: 'P-028', style_no: 'W-TOP-RIB28', name: 'Ribbed Cap Sleeve Top', colors: [{ name: 'IVORY', hex: '#F5F0E1', images: ['/images/3753637_17721602649190_big.webp','/images/detail_3753637_17473818404415_big.webp','/images/detail_3753637_17473818413561_big.webp','/images/detail_3753637_17473818424319_big.webp','/images/detail_3753637_17473821656297_big.webp','/images/detail_3753637_17721602703931_big.webp'] }, { name: 'BLACK', hex: '#000000', images: ['/images/3753637_17721602649190_big.webp','/images/detail_3753637_17473818404415_big.webp','/images/detail_3753637_17473818413561_big.webp','/images/detail_3753637_17473818424319_big.webp','/images/detail_3753637_17473821656297_big.webp','/images/detail_3753637_17721602703931_big.webp'] }, { name: 'MOCHA', hex: '#8b6f4e', images: ['/images/3753637_17721602649190_big.webp','/images/detail_3753637_17473818404415_big.webp','/images/detail_3753637_17473818413561_big.webp'] }], material: 'Viscose 70% Nylon 25% Elastane 5%', origin: 'Korea', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 38000, sample_size: 'S', hs_code: '6109.90', ship_date: '2027-02-20', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Female', images: ['/images/3753637_17721602649190_big.webp','/images/detail_3753637_17473818404415_big.webp','/images/detail_3753637_17473818413561_big.webp','/images/detail_3753637_17473818424319_big.webp','/images/detail_3753637_17473821656297_big.webp','/images/detail_3753637_17721602703931_big.webp'], sizes: ['XS', 'S', 'M', 'L'] },
            { id: 'P-029', style_no: 'W-TEE-RIB29', name: 'Mocha Rib Slim Tee', colors: [{ name: 'MOCHA', hex: '#6b4a3a', images: ['/images/4651360_17453756239869_big.webp','/images/detail_4651360_17453756293991_big.webp','/images/detail_4651360_17453756302946_big.webp'] }, { name: 'BLACK', hex: '#000000', images: ['/images/4651360_17453756239869_big%20%281%29.webp','/images/detail_4651360_17453756293991_big%20%281%29.webp','/images/detail_4651360_17453756302946_big%20%281%29.webp'] }, { name: 'IVORY', hex: '#F5F0E1', images: ['/images/4651360_17453756239869_big.webp','/images/detail_4651360_17453756293991_big.webp','/images/detail_4651360_17453756302946_big.webp'] }], material: 'Rayon 65% Cotton 30% Elastane 5%', origin: 'Korea', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 39000, sample_size: 'S', hs_code: '6109.90', ship_date: '2027-03-10', is_visible: true, is_hero: false, season: { year: 2027, season: 'S/S' }, gender: 'Female', images: ['/images/4651360_17453756239869_big.webp','/images/detail_4651360_17453756293991_big.webp','/images/detail_4651360_17453756302946_big.webp'], sizes: ['XS', 'S', 'M', 'L'] },
            { id: 'P-030', style_no: 'W-TEE-SEM30', name: 'Seamed Waist Fitted Tee', colors: [{ name: 'BLACK', hex: '#000000', images: ['/images/5795933_17731331871118_big.webp','/images/detail_5795933_17731331949197_big.webp','/images/detail_5795933_17731331957121_big.webp','/images/detail_5795933_17731331963495_big.webp'] }, { name: 'IVORY', hex: '#F5F0E1', images: ['/images/5795933_17731331871118_big%20%281%29.webp','/images/detail_5795933_17731331949197_big%20%281%29.webp','/images/detail_5795933_17731331957121_big%20%281%29.webp','/images/detail_5795933_17731331963495_big%20%281%29.webp'] }, { name: 'OLIVE', hex: '#4a4a2d', images: ['/images/5795933_17731331871118_big.webp','/images/detail_5795933_17731331949197_big.webp','/images/detail_5795933_17731331957121_big.webp'] }], material: 'Cotton 80% Polyester 15% Elastane 5%', origin: 'Korea', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 44000, sample_size: 'S', hs_code: '6109.10', ship_date: '2027-03-15', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Female', images: ['/images/5795933_17731331871118_big.webp','/images/detail_5795933_17731331949197_big.webp','/images/detail_5795933_17731331957121_big.webp','/images/detail_5795933_17731331963495_big.webp'], sizes: ['XS', 'S', 'M', 'L'] },

            // --- MALE ---
            { id: 'P-031', style_no: 'M-TEE-OVR31', name: 'Oversized Essential White Tee', colors: [{ name: 'WHITE', hex: '#FFFFFF', images: ['/images/2474511_17515209370374_big.webp','/images/detail_2474511_17506567196226_big.webp','/images/detail_2474511_17506567207007_big.webp','/images/detail_2474511_17506567219055_big.webp'] }, { name: 'BLACK', hex: '#000000', images: ['/images/2474511_17515209370374_big.webp','/images/detail_2474511_17506567196226_big.webp','/images/detail_2474511_17506567207007_big.webp','/images/detail_2474511_17506567219055_big.webp'] }, { name: 'GREY', hex: '#808080', images: ['/images/2474511_17515209370374_big.webp','/images/detail_2474511_17506567196226_big.webp','/images/detail_2474511_17506567207007_big.webp','/images/detail_2474511_17506567219055_big.webp'] }], material: 'Cotton 100%', origin: 'Vietnam', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 29000, sample_size: 'M', hs_code: '6109.10', ship_date: '2027-02-22', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['/images/2474511_17515209370374_big.webp','/images/detail_2474511_17506567196226_big.webp','/images/detail_2474511_17506567207007_big.webp','/images/detail_2474511_17506567219055_big.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-032', style_no: 'M-SHIRT-PLD32', name: 'Ombre Plaid Flannel Overshirt', colors: [{ name: 'BLACK PLAID', hex: '#2a2a2a', images: ['/images/5335741_17574816540164_big.webp','/images/detail_5335741_17573178762628_big.webp','/images/detail_5335741_17573178778792_big.webp','/images/detail_5335741_17573178793278_big.webp','/images/detail_5335741_17573178808675_big.webp','/images/detail_5335741_17574816606833_big.webp'] }, { name: 'BROWN PLAID', hex: '#5a3a2a', images: ['/images/5335741_17574816540164_big.webp','/images/detail_5335741_17573178762628_big.webp','/images/detail_5335741_17573178778792_big.webp','/images/detail_5335741_17573178793278_big.webp','/images/detail_5335741_17573178808675_big.webp','/images/detail_5335741_17574816606833_big.webp'] }, { name: 'GREY PLAID', hex: '#6a6a6a', images: ['/images/5335741_17574816540164_big.webp','/images/detail_5335741_17573178762628_big.webp','/images/detail_5335741_17573178778792_big.webp','/images/detail_5335741_17573178793278_big.webp','/images/detail_5335741_17573178808675_big.webp','/images/detail_5335741_17574816606833_big.webp'] }], material: 'Cotton 70% Polyester 30%', origin: 'Vietnam', category: 'Tops', sub_category: 'Shirt', retail_price_krw: 72000, sample_size: 'M', hs_code: '6205.20', ship_date: '2026-10-15', is_visible: true, is_hero: true, season: { year: 2026, season: 'F/W' }, gender: 'Male', images: ['/images/5335741_17574816540164_big.webp','/images/detail_5335741_17573178762628_big.webp','/images/detail_5335741_17573178778792_big.webp','/images/detail_5335741_17573178793278_big.webp','/images/detail_5335741_17573178808675_big.webp','/images/detail_5335741_17574816606833_big.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
            { id: 'P-033', style_no: 'M-SHIRT-OXF33', name: 'Relaxed Oxford Button-Down Shirt', colors: [{ name: 'LIGHT BLUE', hex: '#B8D4E8', images: ['/images/854339_17171282711855_big.webp','/images/detail_854339_17171282782014_big.webp','/images/detail_854339_17171282792026_big.webp','/images/detail_854339_17171282800672_big.webp','/images/detail_854339_17171282812712_big.webp','/images/detail_854339_17171282823095_big.webp','/images/detail_854339_17171282833012_big.webp'] }, { name: 'WHITE', hex: '#FFFFFF', images: ['/images/854339_17171282711855_big.webp','/images/detail_854339_17171282782014_big.webp','/images/detail_854339_17171282792026_big.webp','/images/detail_854339_17171282800672_big.webp','/images/detail_854339_17171282812712_big.webp','/images/detail_854339_17171282823095_big.webp','/images/detail_854339_17171282833012_big.webp'] }, { name: 'PINK', hex: '#F8C8C8', images: ['/images/854339_17171282711855_big.webp','/images/detail_854339_17171282782014_big.webp','/images/detail_854339_17171282792026_big.webp','/images/detail_854339_17171282800672_big.webp','/images/detail_854339_17171282812712_big.webp','/images/detail_854339_17171282823095_big.webp','/images/detail_854339_17171282833012_big.webp'] }], material: 'Cotton 100%', origin: 'Philippines', category: 'Tops', sub_category: 'Shirt', retail_price_krw: 68000, sample_size: 'M', hs_code: '6205.20', ship_date: '2027-02-28', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Male', images: ['/images/854339_17171282711855_big.webp','/images/detail_854339_17171282782014_big.webp','/images/detail_854339_17171282792026_big.webp','/images/detail_854339_17171282800672_big.webp','/images/detail_854339_17171282812712_big.webp','/images/detail_854339_17171282823095_big.webp','/images/detail_854339_17171282833012_big.webp'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },

            // --- KIDS ---
            { id: 'P-034', style_no: 'K-TEE-STR34', name: 'Kids Retro Stripe Cotton Tee', colors: [{ name: 'GREEN STRIPE', hex: '#0e4d3c', images: ['/images/3034274_16808483004061_big.webp','/images/detail_3034274_16801364076296_big.webp','/images/detail_3034274_16801364088250_big.webp','/images/detail_3034274_16801364104635_big.webp','/images/detail_3034274_16808483109361_big.webp'] }, { name: 'NAVY STRIPE', hex: '#1a2a55', images: ['/images/3034274_16808483004061_big.webp','/images/detail_3034274_16801364076296_big.webp','/images/detail_3034274_16801364088250_big.webp','/images/detail_3034274_16801364104635_big.webp','/images/detail_3034274_16808483109361_big.webp'] }, { name: 'RED STRIPE', hex: '#a33333', images: ['/images/3034274_16808483004061_big.webp','/images/detail_3034274_16801364076296_big.webp','/images/detail_3034274_16801364088250_big.webp','/images/detail_3034274_16801364104635_big.webp','/images/detail_3034274_16808483109361_big.webp'] }], material: 'Cotton 100%', origin: 'Vietnam', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 29000, sample_size: 'M', hs_code: '6109.10', ship_date: '2027-03-05', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Kids', images: ['/images/3034274_16808483004061_big.webp','/images/detail_3034274_16801364076296_big.webp','/images/detail_3034274_16801364088250_big.webp','/images/detail_3034274_16801364104635_big.webp','/images/detail_3034274_16808483109361_big.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
            { id: 'P-035', style_no: 'K-TEE-BAS35', name: 'Kids Everyday Soft Tee', colors: [{ name: 'NAVY', hex: '#1a2a55', images: ['/images/3034284_17657606873521_big.webp','/images/detail_3034284_17657606949756_big.webp','/images/detail_3034284_17657606960891_big.webp','/images/detail_3034284_17657606973395_big.webp','/images/detail_3034284_17657606983902_big.webp','/images/detail_3034284_17657606996436_big.webp','/images/detail_3034284_17657607009733_big.webp'] }, { name: 'WHITE', hex: '#FFFFFF', images: ['/images/3034284_17657606873521_big.webp','/images/detail_3034284_17657606949756_big.webp','/images/detail_3034284_17657606960891_big.webp','/images/detail_3034284_17657606973395_big.webp','/images/detail_3034284_17657606983902_big.webp','/images/detail_3034284_17657606996436_big.webp','/images/detail_3034284_17657607009733_big.webp'] }, { name: 'GREY', hex: '#808080', images: ['/images/3034284_17657606873521_big.webp','/images/detail_3034284_17657606949756_big.webp','/images/detail_3034284_17657606960891_big.webp','/images/detail_3034284_17657606973395_big.webp','/images/detail_3034284_17657606983902_big.webp','/images/detail_3034284_17657606996436_big.webp','/images/detail_3034284_17657607009733_big.webp'] }, { name: 'BLACK', hex: '#000000', images: ['/images/3034284_17657606873521_big.webp','/images/detail_3034284_17657606949756_big.webp','/images/detail_3034284_17657606960891_big.webp'] }], material: 'Cotton 100%', origin: 'Vietnam', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 22000, sample_size: 'M', hs_code: '6109.10', ship_date: '2027-02-28', is_visible: true, is_hero: false, season: { year: 2027, season: 'S/S' }, gender: 'Kids', images: ['/images/3034284_17657606873521_big.webp','/images/detail_3034284_17657606949756_big.webp','/images/detail_3034284_17657606960891_big.webp','/images/detail_3034284_17657606973395_big.webp','/images/detail_3034284_17657606983902_big.webp','/images/detail_3034284_17657606996436_big.webp','/images/detail_3034284_17657607009733_big.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
            { id: 'P-036', style_no: 'K-TEE-PKT36', name: 'Kids Pocket Cotton Tee', colors: [{ name: 'WHITE', hex: '#FFFFFF', images: ['/images/4642826_17392533563167_big.webp','/images/detail_4642826_17392533952852_big.webp','/images/detail_4642826_17392533961746_big.webp','/images/detail_4642826_17392533970763_big.webp','/images/detail_4642826_17392549011223_big.webp'] }, { name: 'BEIGE', hex: '#d9cfb7', images: ['/images/4642826_17392533563167_big.webp','/images/detail_4642826_17392533952852_big.webp','/images/detail_4642826_17392533961746_big.webp','/images/detail_4642826_17392533970763_big.webp','/images/detail_4642826_17392549011223_big.webp'] }, { name: 'SKY BLUE', hex: '#b5cfe0', images: ['/images/4642826_17392533563167_big.webp','/images/detail_4642826_17392533952852_big.webp','/images/detail_4642826_17392533961746_big.webp','/images/detail_4642826_17392533970763_big.webp','/images/detail_4642826_17392549011223_big.webp'] }], material: 'Cotton 100%', origin: 'Korea', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 24000, sample_size: 'M', hs_code: '6109.10', ship_date: '2027-03-08', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Kids', images: ['/images/4642826_17392533563167_big.webp','/images/detail_4642826_17392533952852_big.webp','/images/detail_4642826_17392533961746_big.webp','/images/detail_4642826_17392533970763_big.webp','/images/detail_4642826_17392549011223_big.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
            { id: 'P-037', style_no: 'K-TEE-WSH37', name: 'Kids Pigment Wash Oversized Tee', colors: [{ name: 'WASHED CHARCOAL', hex: '#4d4d4d', images: ['/images/4668493_17441675012461_big.webp','/images/detail_4668493_17441675069696_big.webp','/images/detail_4668493_17441675083346_big.webp','/images/detail_4668493_17441675096298_big.webp','/images/detail_4668493_17441675107840_big.webp'] }, { name: 'WASHED BLACK', hex: '#2a2a2a', images: ['/images/4668493_17441675012461_big.webp','/images/detail_4668493_17441675069696_big.webp','/images/detail_4668493_17441675083346_big.webp','/images/detail_4668493_17441675096298_big.webp','/images/detail_4668493_17441675107840_big.webp'] }, { name: 'WASHED OLIVE', hex: '#4a4a2d', images: ['/images/4668493_17441675012461_big.webp','/images/detail_4668493_17441675069696_big.webp','/images/detail_4668493_17441675083346_big.webp','/images/detail_4668493_17441675096298_big.webp','/images/detail_4668493_17441675107840_big.webp'] }], material: 'Cotton 100%', origin: 'Korea', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 28000, sample_size: 'M', hs_code: '6109.10', ship_date: '2027-03-12', is_visible: true, is_hero: false, season: { year: 2027, season: 'S/S' }, gender: 'Kids', images: ['/images/4668493_17441675012461_big.webp','/images/detail_4668493_17441675069696_big.webp','/images/detail_4668493_17441675083346_big.webp','/images/detail_4668493_17441675096298_big.webp','/images/detail_4668493_17441675107840_big.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
            { id: 'P-038', style_no: 'K-TEE-STC38', name: 'Kids Contrast Stitch Tee', colors: [{ name: 'BLACK', hex: '#000000', images: ['/images/4723891_17417593970044_big.webp','/images/detail_4723891_17417594025186_big.webp','/images/detail_4723891_17417594033723_big.webp','/images/detail_4723891_17417594042402_big.webp','/images/detail_4723891_17417594052544_big.webp'] }, { name: 'WHITE', hex: '#FFFFFF', images: ['/images/4723891_17417593970044_big.webp','/images/detail_4723891_17417594025186_big.webp','/images/detail_4723891_17417594033723_big.webp','/images/detail_4723891_17417594042402_big.webp','/images/detail_4723891_17417594052544_big.webp'] }, { name: 'NAVY', hex: '#1a2a55', images: ['/images/4723891_17417593970044_big.webp','/images/detail_4723891_17417594025186_big.webp','/images/detail_4723891_17417594033723_big.webp','/images/detail_4723891_17417594042402_big.webp','/images/detail_4723891_17417594052544_big.webp'] }], material: 'Cotton 100%', origin: 'Korea', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 26000, sample_size: 'M', hs_code: '6109.10', ship_date: '2027-03-01', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Kids', images: ['/images/4723891_17417593970044_big.webp','/images/detail_4723891_17417594025186_big.webp','/images/detail_4723891_17417594033723_big.webp','/images/detail_4723891_17417594042402_big.webp','/images/detail_4723891_17417594052544_big.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
            { id: 'P-039', style_no: 'K-TEE-CKL39', name: 'Kids Crinkle Textured Tee', colors: [{ name: 'LEMON', hex: '#f0e58a', images: ['/images/4738817_17435827673599_big.webp','/images/detail_4738817_17435827968646_big.webp','/images/detail_4738817_17435827978851_big.webp','/images/detail_4738817_17435833025744_big.webp','/images/detail_4738817_17435833035316_big.webp','/images/detail_4738817_17435833046299_big.webp'] }, { name: 'MINT', hex: '#c8e6d1', images: ['/images/4738817_17435827673599_big.webp','/images/detail_4738817_17435827968646_big.webp','/images/detail_4738817_17435827978851_big.webp','/images/detail_4738817_17435833025744_big.webp','/images/detail_4738817_17435833035316_big.webp','/images/detail_4738817_17435833046299_big.webp'] }, { name: 'PINK', hex: '#f4c7cc', images: ['/images/4738817_17435827673599_big.webp','/images/detail_4738817_17435827968646_big.webp','/images/detail_4738817_17435827978851_big.webp','/images/detail_4738817_17435833025744_big.webp','/images/detail_4738817_17435833035316_big.webp','/images/detail_4738817_17435833046299_big.webp'] }], material: 'Polyester 95% Elastane 5%', origin: 'Korea', category: 'Tops', sub_category: 'T-Shirt', retail_price_krw: 32000, sample_size: 'M', hs_code: '6109.90', ship_date: '2027-03-18', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Kids', images: ['/images/4738817_17435827673599_big.webp','/images/detail_4738817_17435827968646_big.webp','/images/detail_4738817_17435827978851_big.webp','/images/detail_4738817_17435833025744_big.webp','/images/detail_4738817_17435833035316_big.webp','/images/detail_4738817_17435833046299_big.webp'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },

            // --- ACCESSORIES ---
            { id: 'P-040', style_no: 'A-WLT-BIF40', name: 'Saffiano Leather Bifold Card Wallet', colors: [{ name: 'BLACK', hex: '#000000', images: ['/images/2926616_17138340809380_big.webp','/images/detail_2926616_16740201632216_big.webp','/images/detail_2926616_16740201646010_big.webp','/images/detail_2926616_16740201659636_big.webp','/images/detail_2926616_16740201675974_big.webp','/images/detail_2926616_16740201695364_big.webp','/images/detail_2926616_16740201719246_big.webp','/images/detail_2926616_16762569790319_big.webp'] }, { name: 'BROWN', hex: '#5a3a28', images: ['/images/2926616_17138340809380_big.webp','/images/detail_2926616_16740201632216_big.webp','/images/detail_2926616_16740201646010_big.webp','/images/detail_2926616_16740201659636_big.webp','/images/detail_2926616_16740201675974_big.webp','/images/detail_2926616_16740201695364_big.webp','/images/detail_2926616_16740201719246_big.webp','/images/detail_2926616_16762569790319_big.webp'] }, { name: 'TAN', hex: '#b08968', images: ['/images/2926616_17138340809380_big.webp','/images/detail_2926616_16740201632216_big.webp','/images/detail_2926616_16740201646010_big.webp','/images/detail_2926616_16740201659636_big.webp','/images/detail_2926616_16740201675974_big.webp','/images/detail_2926616_16740201695364_big.webp','/images/detail_2926616_16740201719246_big.webp','/images/detail_2926616_16762569790319_big.webp'] }], material: 'Cowhide Leather 100%', origin: 'Korea', category: 'Accessories', sub_category: 'Wallet', retail_price_krw: 79000, sample_size: 'FREE', hs_code: '4202.31', ship_date: '2027-02-15', is_visible: true, is_hero: true, season: { year: 0, season: 'Carry Over' }, gender: 'Accessories', images: ['/images/2926616_17138340809380_big.webp','/images/detail_2926616_16740201632216_big.webp','/images/detail_2926616_16740201646010_big.webp','/images/detail_2926616_16740201659636_big.webp','/images/detail_2926616_16740201675974_big.webp','/images/detail_2926616_16740201695364_big.webp','/images/detail_2926616_16740201719246_big.webp','/images/detail_2926616_16762569790319_big.webp'], sizes: ['FREE'] },
            { id: 'P-041', style_no: 'A-BAG-SLG41', name: 'Nylon Sling Crossbody Bag', colors: [{ name: 'BLACK', hex: '#000000', images: ['/images/3938149_17230192278858_big.webp','/images/detail_3938149_17228461840154_big.webp','/images/detail_3938149_17228461848271_big.webp','/images/detail_3938149_17228461857616_big.webp','/images/detail_3938149_17230192331369_big.webp'] }, { name: 'OLIVE', hex: '#4a4a2d', images: ['/images/3938149_17230192278858_big.webp','/images/detail_3938149_17228461840154_big.webp','/images/detail_3938149_17228461848271_big.webp','/images/detail_3938149_17228461857616_big.webp','/images/detail_3938149_17230192331369_big.webp'] }, { name: 'BEIGE', hex: '#c9bba0', images: ['/images/3938149_17230192278858_big.webp','/images/detail_3938149_17228461840154_big.webp','/images/detail_3938149_17228461848271_big.webp','/images/detail_3938149_17228461857616_big.webp','/images/detail_3938149_17230192331369_big.webp'] }], material: 'Nylon 100%', origin: 'Vietnam', category: 'Accessories', sub_category: 'Bag', retail_price_krw: 58000, sample_size: 'FREE', hs_code: '4202.22', ship_date: '2027-03-05', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Accessories', images: ['/images/3938149_17230192278858_big.webp','/images/detail_3938149_17228461840154_big.webp','/images/detail_3938149_17228461848271_big.webp','/images/detail_3938149_17228461857616_big.webp','/images/detail_3938149_17230192331369_big.webp'], sizes: ['FREE'] },
            { id: 'P-042', style_no: 'A-BAG-SHL42', name: 'Packable Nylon Shoulder Bag', colors: [{ name: 'DARK OLIVE', hex: '#2e3626', images: ['/images/4641082_17429672522455_big.webp','/images/detail_4641082_17429672578472_big.webp','/images/detail_4641082_17429672586447_big.webp','/images/detail_4641082_17429672595757_big.webp','/images/detail_4641082_17429672605400_big.webp'] }, { name: 'BLACK', hex: '#000000', images: ['/images/4641082_17429672522455_big.webp','/images/detail_4641082_17429672578472_big.webp','/images/detail_4641082_17429672586447_big.webp','/images/detail_4641082_17429672595757_big.webp','/images/detail_4641082_17429672605400_big.webp'] }, { name: 'NAVY', hex: '#1a2a55', images: ['/images/4641082_17429672522455_big.webp','/images/detail_4641082_17429672578472_big.webp','/images/detail_4641082_17429672586447_big.webp','/images/detail_4641082_17429672595757_big.webp','/images/detail_4641082_17429672605400_big.webp'] }], material: 'Nylon 100%', origin: 'Vietnam', category: 'Accessories', sub_category: 'Bag', retail_price_krw: 49000, sample_size: 'FREE', hs_code: '4202.22', ship_date: '2027-02-20', is_visible: true, is_hero: false, season: { year: 2027, season: 'S/S' }, gender: 'Accessories', images: ['/images/4641082_17429672522455_big.webp','/images/detail_4641082_17429672578472_big.webp','/images/detail_4641082_17429672586447_big.webp','/images/detail_4641082_17429672595757_big.webp','/images/detail_4641082_17429672605400_big.webp'], sizes: ['FREE'] },
            { id: 'P-043', style_no: 'A-BAG-HOB43', name: 'Canvas Hobo Shopper Bag', colors: [{ name: 'BEIGE', hex: '#d4c2a0', images: ['/images/5175154_17532262965362_big.webp','/images/detail_5175154_17532263020115_big.webp','/images/detail_5175154_17532263028948_big.webp','/images/detail_5175154_17532263038579_big.webp','/images/detail_5175154_17532263050076_big.webp'] }, { name: 'BLACK', hex: '#000000', images: ['/images/5175154_17532262965362_big.webp','/images/detail_5175154_17532263020115_big.webp','/images/detail_5175154_17532263028948_big.webp','/images/detail_5175154_17532263038579_big.webp','/images/detail_5175154_17532263050076_big.webp'] }, { name: 'IVORY', hex: '#ece4d3', images: ['/images/5175154_17532262965362_big.webp','/images/detail_5175154_17532263020115_big.webp','/images/detail_5175154_17532263028948_big.webp','/images/detail_5175154_17532263038579_big.webp','/images/detail_5175154_17532263050076_big.webp'] }], material: 'Cotton Canvas 100%', origin: 'Korea', category: 'Accessories', sub_category: 'Bag', retail_price_krw: 54000, sample_size: 'FREE', hs_code: '4202.22', ship_date: '2027-03-10', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Accessories', images: ['/images/5175154_17532262965362_big.webp','/images/detail_5175154_17532263020115_big.webp','/images/detail_5175154_17532263028948_big.webp','/images/detail_5175154_17532263038579_big.webp','/images/detail_5175154_17532263050076_big.webp'], sizes: ['FREE'] },
            { id: 'P-044', style_no: 'A-BAG-GRP44', name: 'Graphic Print Canvas Tote', colors: [{ name: 'BLACK GRAPHIC', hex: '#000000', images: ['/images/5602490_17641364638590_big.webp','/images/detail_5602490_17641364696750_big.webp','/images/detail_5602490_17641364704508_big.webp','/images/detail_5602490_17641364714160_big.webp'] }, { name: 'IVORY GRAPHIC', hex: '#f0ead6', images: ['/images/5602490_17641364638590_big.webp','/images/detail_5602490_17641364696750_big.webp','/images/detail_5602490_17641364704508_big.webp','/images/detail_5602490_17641364714160_big.webp'] }, { name: 'NAVY GRAPHIC', hex: '#1a2a55', images: ['/images/5602490_17641364638590_big.webp','/images/detail_5602490_17641364696750_big.webp','/images/detail_5602490_17641364704508_big.webp','/images/detail_5602490_17641364714160_big.webp'] }], material: 'Cotton Canvas 100%', origin: 'Korea', category: 'Accessories', sub_category: 'Bag', retail_price_krw: 42000, sample_size: 'FREE', hs_code: '4202.22', ship_date: '2027-03-15', is_visible: true, is_hero: true, season: { year: 2027, season: 'S/S' }, gender: 'Accessories', images: ['/images/5602490_17641364638590_big.webp','/images/detail_5602490_17641364696750_big.webp','/images/detail_5602490_17641364704508_big.webp','/images/detail_5602490_17641364714160_big.webp'], sizes: ['FREE'] }
        ];

        const ORDERS = [
            { order_id: 'ORD-2026-0002', partner_id: 'PTR-002', partner_name: 'Middle East Fashion Hub', status: '주문승인', rejection_reason: null, total_qty: 300, total_amount: 9800.00, items: [
                { product: PRODUCTS[2], color: 'NAVY', size: 'M', qty: 100, unit_price: 32.69, subtotal: 3269.00 },
                { product: PRODUCTS[2], color: 'NAVY', size: 'L', qty: 100, unit_price: 32.69, subtotal: 3269.00 },
                { product: PRODUCTS[3], color: 'GREY', size: 'M', qty: 100, unit_price: 32.69, subtotal: 3269.00 }
            ], created_at: '2026-04-08T14:20:00', updated_at: '2026-04-09T11:00:00' },
            { order_id: 'ORD-2026-0003', partner_id: 'PTR-003', partner_name: 'Singapore Style Partners', status: '반려', rejection_reason: 'Requested quantities exceed available stock for some items.', total_qty: 500, total_amount: 15200.00, items: [
                { product: PRODUCTS[4], color: 'FOREST GREEN', size: 'S', qty: 150, unit_price: 30.38, subtotal: 4557.00 },
                { product: PRODUCTS[5], color: 'BLACK', size: 'M', qty: 200, unit_price: 32.69, subtotal: 6538.00 },
                { product: PRODUCTS[5], color: 'BLACK', size: 'L', qty: 150, unit_price: 32.69, subtotal: 4903.50 }
            ], created_at: '2026-04-05T16:45:00', updated_at: '2026-04-06T10:30:00' }
        ];

        // HELPERS
        const calculateWholesalePrice = (retailKrw) => {
            return Math.floor((retailKrw / EXCHANGE_RATE) * (1 - CURRENT_PARTNER.discount_rate) * 100) / 100;
        };

        const LATEST_SEASON = { year: 2027, season: 'S/S' };
        const formatSeason = (season) => {
            if (!season) return '';
            if (season.season === 'Carry Over') return '';
            if (season.year === LATEST_SEASON.year && season.season === LATEST_SEASON.season) return 'NEW';
            const yy = season.year.toString().slice(-2);
            const ss = season.season === 'S/S' ? 'SS' : season.season;
            return `${yy}-${ss}`;
        };
        const formatSeasonFull = (season) => {
            if (!season) return '';
            if (season.season === 'Carry Over') return 'Carry Over';
            const yy = season.year.toString().slice(-2);
            const ss = season.season === 'S/S' ? 'S/S' : season.season;
            return `${yy}-${ss}`;
        };

        const formatUSD = (amount) => `$${amount.toFixed(2)}`;
        const formatKRW = (amount) => `₩${Math.round(amount).toLocaleString()}`;

        // Export a single order's items to an .xlsx file
        const exportOrderToExcel = (order) => {
            if (typeof XLSX === 'undefined') {
                alert('Excel library is still loading. Please try again in a moment.');
                return;
            }
            const rows = (order.items || []).map((item, idx) => ({
                'No.': idx + 1,
                'Product': item.product.name,
                'Style No': item.product.style_no,
                'Color': item.color || '',
                'Size': item.size || '',
                'Qty': item.qty,
                'Unit Price (USD)': Number(item.unit_price.toFixed(2)),
                'Subtotal (USD)': Number(item.subtotal.toFixed(2)),
            }));
            rows.push({
                'No.': '',
                'Product': '',
                'Style No': '',
                'Color': '',
                'Size': 'Total',
                'Qty': order.total_qty,
                'Unit Price (USD)': '',
                'Subtotal (USD)': Number(order.total_amount.toFixed(2)),
            });
            const ws = XLSX.utils.json_to_sheet(rows);
            ws['!cols'] = [
                { wch: 5 }, { wch: 32 }, { wch: 16 }, { wch: 14 },
                { wch: 8 }, { wch: 8 }, { wch: 14 }, { wch: 14 },
            ];
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Order Items');
            XLSX.writeFile(wb, `${order.order_id}.xlsx`);
        };

        // Export all orders of the partner into a single workbook
        // Sheet 1: Orders summary, Sheet 2: All line items consolidated
        const exportAllOrdersToExcel = (orderList) => {
            if (typeof XLSX === 'undefined') {
                alert('Excel library is still loading. Please try again in a moment.');
                return;
            }
            if (!orderList || orderList.length === 0) {
                alert('No orders to export.');
                return;
            }
            const statusMap = { '주문접수': 'Pending', '주문승인': 'Approved', '반려': 'Rejected' };

            const summaryRows = orderList.map((order, idx) => ({
                'No.': idx + 1,
                'Order Number': order.order_id,
                'Order Date': order.created_at ? String(order.created_at).replace('T', ' ').slice(0, 19) : '',
                'Last Updated': order.updated_at ? String(order.updated_at).replace('T', ' ').slice(0, 19) : '',
                'Status': statusMap[order.status] || order.status || '',
                'Total Qty': order.total_qty,
                'Total Amount (USD)': Number((order.total_amount || 0).toFixed(2)),
            }));

            const itemRows = [];
            orderList.forEach(order => {
                (order.items || []).forEach((item, idx) => {
                    itemRows.push({
                        'Order Number': order.order_id,
                        'Order Date': order.created_at ? String(order.created_at).replace('T', ' ').slice(0, 19) : '',
                        'Status': statusMap[order.status] || order.status || '',
                        'Line No.': idx + 1,
                        'Product': item.product.name,
                        'Style No': item.product.style_no,
                        'Color': item.color || '',
                        'Size': item.size || '',
                        'Qty': item.qty,
                        'Unit Price (USD)': Number(item.unit_price.toFixed(2)),
                        'Subtotal (USD)': Number(item.subtotal.toFixed(2)),
                    });
                });
            });

            const wb = XLSX.utils.book_new();
            const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
            wsSummary['!cols'] = [
                { wch: 5 }, { wch: 18 }, { wch: 20 }, { wch: 20 },
                { wch: 12 }, { wch: 10 }, { wch: 16 },
            ];
            XLSX.utils.book_append_sheet(wb, wsSummary, 'Orders Summary');

            const wsItems = XLSX.utils.json_to_sheet(itemRows);
            wsItems['!cols'] = [
                { wch: 18 }, { wch: 20 }, { wch: 12 }, { wch: 8 }, { wch: 32 },
                { wch: 16 }, { wch: 14 }, { wch: 8 }, { wch: 8 }, { wch: 14 }, { wch: 14 },
            ];
            XLSX.utils.book_append_sheet(wb, wsItems, 'All Line Items');

            const today = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(wb, `orders_${today}.xlsx`);
        };

        // Export the current cart into an .xlsx file (one row per color+size line)
        const exportCartToExcel = (cartData) => {
            if (typeof XLSX === 'undefined') {
                alert('Excel library is still loading. Please try again in a moment.');
                return;
            }
            const rows = [];
            let grandQty = 0;
            let grandAmount = 0;
            Object.entries(cartData || {}).forEach(([productId, colorQties]) => {
                const product = PRODUCTS.find(p => p.id === productId);
                if (!product) return;
                const wholesale = calculateWholesalePrice(product.retail_price_krw);
                Object.entries(colorQties).forEach(([colorName, sizeQties]) => {
                    Object.entries(sizeQties).forEach(([size, qty]) => {
                        if (!qty || qty <= 0) return;
                        const subtotal = qty * wholesale;
                        grandQty += qty;
                        grandAmount += subtotal;
                        rows.push({
                            'No.': rows.length + 1,
                            'Product': product.name,
                            'Style No': product.style_no,
                            'Color': colorName,
                            'Size': size,
                            'Qty': qty,
                            'Unit Price (USD)': Number(wholesale.toFixed(2)),
                            'Subtotal (USD)': Number(subtotal.toFixed(2)),
                        });
                    });
                });
            });

            if (rows.length === 0) {
                alert('Shopping bag is empty.');
                return;
            }

            rows.push({
                'No.': '',
                'Product': '',
                'Style No': '',
                'Color': '',
                'Size': 'Total',
                'Qty': grandQty,
                'Unit Price (USD)': '',
                'Subtotal (USD)': Number(grandAmount.toFixed(2)),
            });

            const ws = XLSX.utils.json_to_sheet(rows);
            ws['!cols'] = [
                { wch: 5 }, { wch: 32 }, { wch: 16 }, { wch: 14 },
                { wch: 8 }, { wch: 8 }, { wch: 14 }, { wch: 14 },
            ];
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Shopping Bag');
            const today = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(wb, `cart_${today}.xlsx`);
        };
        const formatDateTime = (dateStr) => {
            const d = new Date(dateStr);
            const yyyy = d.getFullYear();
            const MM = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
        };

        // COMPONENTS
        const ProductCard = ({ product, onSelect, cartQty }) => {
            const wholesalePrice = calculateWholesalePrice(product.retail_price_krw);
            const seasonLabel = formatSeason(product.season);
            const images = product.colors[0].images;
            // Append a clone of the first image so the last → first transition continues forward (seamless loop)
            const slides = images.length > 1 ? [...images, images[0]] : images;
            const [imgIndex, setImgIndex] = useState(0);
            const [enableTransition, setEnableTransition] = useState(true);
            const intervalRef = useRef(null);
            const timeoutRef = useRef(null);

            const startAutoSlide = () => {
                if (images.length <= 1 || intervalRef.current || timeoutRef.current) return;
                // First slide kicks in at 1.2s, then every 2s after
                timeoutRef.current = setTimeout(() => {
                    setEnableTransition(true);
                    setImgIndex(prev => prev + 1);
                    timeoutRef.current = null;
                    intervalRef.current = setInterval(() => {
                        setEnableTransition(true);
                        setImgIndex(prev => prev + 1);
                    }, 2000);
                }, 1200);
            };

            const stopAutoSlide = () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                setEnableTransition(false);
                setImgIndex(0);
            };

            const handleTransitionEnd = (e) => {
                if (e.propertyName !== 'transform') return;
                if (imgIndex === images.length) {
                    setEnableTransition(false);
                    setImgIndex(0);
                }
            };

            // After a no-transition snap (reset), re-enable transitions on the next frame
            useEffect(() => {
                if (!enableTransition) {
                    const id = requestAnimationFrame(() => {
                        requestAnimationFrame(() => setEnableTransition(true));
                    });
                    return () => cancelAnimationFrame(id);
                }
            }, [enableTransition]);

            useEffect(() => () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }, []);

            return (
                <div className="product-card" onClick={() => onSelect(product)} onMouseEnter={startAutoSlide} onMouseLeave={stopAutoSlide}>
                    <div className={`product-image-container`} style={cartQty > 0 ? { position: 'relative' } : {}}>
                        <div className="product-image-slider"
                            onTransitionEnd={handleTransitionEnd}
                            style={{
                                display: 'flex',
                                width: '100%',
                                height: '100%',
                                transform: `translateX(-${imgIndex * 100}%)`,
                                transition: enableTransition ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                            }}>
                            {slides.map((img, i) => (
                                <img key={i} src={img} alt={product.name} className="product-image" draggable={false} style={{ flexShrink: 0, width: '100%' }} />
                            ))}
                        </div>
                        {cartQty > 0 && <div className="product-qty-bar">QTY: {cartQty} <button onClick={(e) => { e.stopPropagation(); }}>REMOVE</button></div>}
                    </div>
                    <div className="product-info">
                        {(seasonLabel || product.is_hero) && <div className="product-badges">
                            {seasonLabel && <span className="product-badge badge-season">{seasonLabel}</span>}
                            {product.is_hero && <span className="product-badge badge-hero">HERO</span>}
                        </div>}
                        <div className="product-name">{product.name}</div>
                        <div className="product-meta">{product.style_no} · {product.colors[0].name} · {product.gender} · {seasonLabel}</div>
                        <div className="product-price">{formatUSD(wholesalePrice)}</div>
                        <div className="product-price-retail">{formatKRW(product.retail_price_krw)}</div>
                    </div>
                </div>
            );
        };

        const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, isEditMode = false, existingQties = {} }) => {
            const [selectedImageIndex, setSelectedImageIndex] = useState(0);
            const [selectedColorIndex, setSelectedColorIndex] = useState(0);
            const [fullscreenImage, setFullscreenImage] = useState(false);
            const touchStartX = useRef(null);
            const touchStartY = useRef(null);
            const touchDeltaX = useRef(0);
            const [allColorQuantities, setAllColorQuantities] = useState(() => {
                const init = {};
                product.colors.forEach((color, colorIdx) => {
                    init[colorIdx] = {};
                    product.sizes.forEach(size => {
                        init[colorIdx][size] = 0;
                    });
                });
                if (isEditMode && existingQties) {
                    Object.entries(existingQties).forEach(([colorName, sizeQties]) => {
                        const colorIdx = product.colors.findIndex(c => c.name === colorName);
                        if (colorIdx !== -1) {
                            Object.entries(sizeQties).forEach(([size, qty]) => {
                                init[colorIdx][size] = parseInt(qty) || 0;
                            });
                        }
                    });
                }
                return init;
            });

            const currentColor = product.colors[selectedColorIndex] || product.colors[0];
            const quantities = allColorQuantities[selectedColorIndex] || {};

            const wholesalePrice = calculateWholesalePrice(product.retail_price_krw);
            const totalQty = Object.values(allColorQuantities).reduce((sum, colorQties) => {
                return sum + Object.values(colorQties).reduce((a, b) => a + b, 0);
            }, 0);
            const totalAmount = totalQty * wholesalePrice;

            const handleQtyChange = (size, val) => {
                const currentQties = allColorQuantities[selectedColorIndex] || {};
                setAllColorQuantities({
                    ...allColorQuantities,
                    [selectedColorIndex]: { ...currentQties, [size]: Math.max(0, parseInt(val) || 0) }
                });
            };

            const [bulkQty, setBulkQty] = useState('');

            const handleApplyToAll = () => {
                const val = Math.max(0, parseInt(bulkQty) || 0);
                const next = {};
                product.sizes.forEach(size => { next[size] = val; });
                setAllColorQuantities({
                    ...allColorQuantities,
                    [selectedColorIndex]: next
                });
            };

            const handleCopyFromColor = (sourceIdxStr) => {
                if (sourceIdxStr === '') return;
                const sourceIdx = parseInt(sourceIdxStr);
                const sourceQties = allColorQuantities[sourceIdx] || {};
                const copied = {};
                product.sizes.forEach(size => { copied[size] = sourceQties[size] || 0; });
                setAllColorQuantities({
                    ...allColorQuantities,
                    [selectedColorIndex]: copied
                });
            };

            const copyableColors = product.colors
                .map((c, idx) => ({ c, idx }))
                .filter(({ idx }) => {
                    if (idx === selectedColorIndex) return false;
                    const q = allColorQuantities[idx] || {};
                    return Object.values(q).some(v => v > 0);
                });

            useEffect(() => {
                if (isOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
                return () => { document.body.style.overflow = ''; };
            }, [isOpen]);

            if (!isOpen) return null;

            return (
                <div className="modal-backdrop" onClick={onClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <span>{product.name}</span>
                            </div>
                            <button className="modal-close" onClick={onClose} aria-label="Close">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="product-detail">
                                <div className="detail-images">
                                    <div className="detail-main-image">
                                        <img src={currentColor.images[selectedImageIndex]} alt={product.name} draggable={false} />
                                        {((product.season && product.season.year === LATEST_SEASON.year && product.season.season === LATEST_SEASON.season) || product.is_hero) && (
                                            <div className="detail-image-badges">
                                                {product.season && product.season.year === LATEST_SEASON.year && product.season.season === LATEST_SEASON.season && <span className="product-badge badge-season" style={{fontSize:'11px'}}>NEW</span>}
                                                {product.is_hero && <span className="product-badge badge-hero" style={{fontSize:'11px'}}>HERO</span>}
                                            </div>
                                        )}
                                        <button className="img-zoom-btn" onClick={() => setFullscreenImage(true)} title="View full size">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                                        </button>
                                    </div>
                                    {fullscreenImage && <div
                                        className="img-fullscreen-overlay"
                                        onClick={() => setFullscreenImage(false)}
                                        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; touchDeltaX.current = 0; }}
                                        onTouchMove={(e) => { touchDeltaX.current = e.touches[0].clientX - (touchStartX.current || 0); }}
                                        onTouchEnd={() => {
                                            const dx = touchDeltaX.current || 0;
                                            if (Math.abs(dx) > 50 && currentColor.images.length > 1) {
                                                if (dx < 0) {
                                                    setSelectedImageIndex((selectedImageIndex + 1) % currentColor.images.length);
                                                } else {
                                                    setSelectedImageIndex((selectedImageIndex - 1 + currentColor.images.length) % currentColor.images.length);
                                                }
                                            }
                                            touchStartX.current = null;
                                            touchDeltaX.current = 0;
                                        }}
                                    >
                                        <button className="img-fullscreen-close" onClick={() => setFullscreenImage(false)}>×</button>
                                        {currentColor.images.length > 1 && (
                                            <button className="img-fullscreen-nav prev" onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((selectedImageIndex - 1 + currentColor.images.length) % currentColor.images.length); }}>&#8249;</button>
                                        )}
                                        <img
                                            src={currentColor.images[selectedImageIndex]}
                                            alt={product.name}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{cursor:'default', userSelect:'none', WebkitUserSelect:'none', pointerEvents:'none'}}
                                            draggable={false}
                                        />
                                        {currentColor.images.length > 1 && (
                                            <button className="img-fullscreen-nav next" onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((selectedImageIndex + 1) % currentColor.images.length); }}>&#8250;</button>
                                        )}
                                        {currentColor.images.length > 1 && (
                                            <div className="img-fullscreen-counter">{selectedImageIndex + 1} / {currentColor.images.length}</div>
                                        )}
                                    </div>}
                                    <div className="detail-thumbnails">
                                        {currentColor.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={`detail-thumbnail ${idx === selectedImageIndex ? 'active' : ''}`}
                                                onClick={() => setSelectedImageIndex(idx)}
                                            >
                                                <img src={img} alt={`thumbnail ${idx}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="detail-info">
                                    <div className="detail-field">
                                        <div className="detail-label">Style No.</div>
                                        <div className="detail-value">{product.style_no}</div>
                                    </div>
                                    <div className="detail-field">
                                        <div className="detail-label">Item Season</div>
                                        <div className="detail-value">{formatSeasonFull(product.season) || 'N/A'}</div>
                                    </div>
                                    <div className="detail-field">
                                        <div className="detail-label">Material</div>
                                        <div className="detail-value">{product.material}</div>
                                    </div>
                                    <div className="detail-field">
                                        <div className="detail-label">Origin</div>
                                        <div className="detail-value">{product.origin}</div>
                                    </div>
                                    <div className="detail-row">
                                        <div className="detail-field">
                                            <div className="detail-label">Delivery Date</div>
                                            <div className="detail-value">{product.ship_date || 'N/A'}</div>
                                        </div>
                                        <div className="detail-field">
                                            <div className="detail-label">Sample Size</div>
                                            <div className="detail-value">{product.sample_size}</div>
                                        </div>
                                    </div>
                                    <div className="detail-row">
                                        <div className="detail-field">
                                            <div className="detail-label">Wholesale Price</div>
                                            <div className="detail-price">{formatUSD(wholesalePrice)}</div>
                                        </div>
                                        <div className="detail-field">
                                            <div className="detail-label">Retail(KRW)</div>
                                            <div className="detail-value">{formatKRW(product.retail_price_krw)}</div>
                                        </div>
                                    </div>
                                    <div className="detail-field">
                                        <div className="detail-label">Color</div>
                                        <div className="color-swatches" style={{ paddingBottom: '1.25rem' }}>
                                            <div className="color-swatches-row">
                                                {product.colors.map((color, idx) => (
                                                    <div key={idx} style={{ position: 'relative' }}>
                                                        <button
                                                            className={`color-swatch ${idx === selectedColorIndex ? 'active' : ''}`}
                                                            style={{ backgroundColor: color.hex }}
                                                            onClick={() => {
                                                                setSelectedColorIndex(idx);
                                                                setSelectedImageIndex(0);
                                                            }}
                                                            title={color.name}
                                                        />
                                                        {idx === selectedColorIndex && (
                                                            <div className="color-swatch-label" style={idx === 0 ? { left: 0 } : { left: '50%', transform: 'translateX(-50%)' }}>{color.name}</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-field" style={{ borderBottom: 'none' }}>
                                        <div className="detail-label">Quantity by Size</div>
                                        <div className="bulk-size-helper">
                                            <span className="bulk-size-helper-label">Bulk</span>
                                            <div className="bulk-size-helper-group">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    value={bulkQty}
                                                    onChange={(e) => setBulkQty(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { handleApplyToAll(); }}}
                                                />
                                                <button
                                                    className="bulk-size-helper-btn"
                                                    onClick={handleApplyToAll}
                                                    disabled={bulkQty === '' || parseInt(bulkQty) < 0}
                                                >Apply to all</button>
                                            </div>
                                            {copyableColors.length > 0 && (
                                                <>
                                                    <div className="bulk-size-helper-divider"></div>
                                                    <div className="bulk-size-helper-group">
                                                        <span className="bulk-size-helper-label">Copy from</span>
                                                        <select
                                                            value=""
                                                            onChange={(e) => { handleCopyFromColor(e.target.value); e.target.value = ''; }}
                                                        >
                                                            <option value="">Select color</option>
                                                            {copyableColors.map(({ c, idx }) => (
                                                                <option key={idx} value={idx}>{c.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="sizes-grid" style={{ gridTemplateColumns: `repeat(${product.sizes.length < 3 ? 3 : Math.min(4, product.sizes.length)}, 1fr)` }}>
                                            {product.sizes.map(size => (
                                                <div key={size}>
                                                    <div style={{ fontSize: '11px', color: 'var(--color-fg-low)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>{size}</div>
                                                    <div className="size-input-wrap">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={quantities[size] || ''}
                                                            placeholder="0"
                                                            onChange={(e) => handleQtyChange(size, e.target.value)}
                                                            className="size-input"
                                                        />
                                                        <div className="size-spin size-spin-up" onClick={() => handleQtyChange(size, (quantities[size] || 0) + 1)}>▲</div>
                                                        <div className="size-spin size-spin-down" onClick={() => handleQtyChange(size, Math.max(0, (quantities[size] || 0) - 1))}>▼</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Color selection summary tags */}
                                    <div className="color-selection-tags">
                                        {Object.entries(allColorQuantities).map(([colorIdx, sizeQties]) => {
                                            const hasQty = Object.values(sizeQties).some(q => q > 0);
                                            if (!hasQty) return null;
                                            const colorObj = product.colors[parseInt(colorIdx)];
                                            return (
                                                <div key={colorIdx} className="color-tag">
                                                    <span className="color-tag-name">{colorObj.name}</span>
                                                    <span className="color-tag-sizes">
                                                        {Object.entries(sizeQties).filter(([, q]) => q > 0).map(([size, q]) => (
                                                            <span key={size} className="size-qty-pair">
                                                                <span className="size-label">{size}</span>
                                                                <span className="size-qty">{q}</span>
                                                            </span>
                                                        ))}
                                                    </span>
                                                    <button className="color-tag-remove" onClick={() => {
                                                        const reset = {};
                                                        product.sizes.forEach(s => { reset[s] = 0; });
                                                        setAllColorQuantities({ ...allColorQuantities, [colorIdx]: reset });
                                                    }}>&times;</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="modal-summary" style={{ padding: '1rem 0 0', border: 'none' }}>
                                        <div className="modal-summary-item">
                                            <div className="detail-label">Total Qty</div>
                                            <div className="detail-price">{totalQty.toLocaleString()}</div>
                                        </div>
                                        <div className="modal-summary-item" style={{ textAlign: 'right' }}>
                                            <div className="detail-label">Total Amount</div>
                                            <div className="detail-price">{formatUSD(totalAmount)}</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1rem' }}>
                                        <button className="btn-black" onClick={() => {
                                            const qtyByColor = {};
                                            Object.entries(allColorQuantities).forEach(([colorIdx, sizeQties]) => {
                                                const colorName = product.colors[parseInt(colorIdx)].name;
                                                const validSizes = {};
                                                product.sizes.forEach(size => {
                                                    if (sizeQties[size] > 0) {
                                                        validSizes[size] = sizeQties[size];
                                                    }
                                                });
                                                if (Object.keys(validSizes).length > 0) {
                                                    qtyByColor[colorName] = validSizes;
                                                }
                                            });
                                            onAddToCart(product, qtyByColor);
                                            onClose();
                                        }}>
                                            {isEditMode ? 'UPDATE SELECTION' : 'ADD TO SELECTION'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        // MAIN APP
        const App = () => {
            const [page, setPage] = useState('login');
            const [language, setLanguage] = useState('EN');
            const [email, setEmail] = useState('');
            const [cart, setCart] = useState({});
            const [selectedProduct, setSelectedProduct] = useState(null);
            const [modalOpen, setModalOpen] = useState(false);
            const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
            const [searchTerm, setSearchTerm] = useState('');
            const [selectedMainCats, setSelectedMainCats] = useState([]);
            const [selectedSubCats, setSelectedSubCats] = useState({});
            const [catDropdownOpen, setCatDropdownOpen] = useState(null);
            const catDropdownRef = useRef(null);
            const [filterDropdownOpen, setFilterDropdownOpen] = useState(null);
            const filterDropdownRef = useRef(null);
            const [showSearch, setShowSearch] = useState(false);
            const [orderSubmitted, setOrderSubmitted] = useState(false);
            const [editingProduct, setEditingProduct] = useState(null);
            const [selectedOrder, setSelectedOrder] = useState(null);
            const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
            const [activeFilter, setActiveFilter] = useState('all');
            const [filterYear, setFilterYear] = useState('All');
            const [filterSeason, setFilterSeason] = useState('All');
            const [selectedGenders, setSelectedGenders] = useState([]);
            const [orders, setOrders] = useState(ORDERS);
            const [scrollY, setScrollY] = useState(0);
            const [heroRevealed, setHeroRevealed] = useState(false);
            const heroScrollDone = useRef(false);

            useEffect(() => {
                if (page !== 'home') {
                    heroScrollDone.current = false;
                    setHeroRevealed(false);
                    return;
                }
                if (heroScrollDone.current) return;
                // Start with the viewport 100px above the banners (so the hero "opens" with some headroom above the banners)
                const heroEl = document.querySelector('.hero-section');
                const bannerEl = document.querySelector('.category-banners .cat-banner');
                let offset;
                if (bannerEl) {
                    // 100px of space above the banner row when entry animation starts
                    offset = bannerEl.getBoundingClientRect().top + window.scrollY - 100;
                } else if (heroEl) {
                    offset = heroEl.offsetHeight;
                } else {
                    offset = 600;
                }
                window.scrollTo(0, Math.max(0, offset));
                // After a brief pause, smooth-scroll up to reveal hero
                const t1 = setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 300);
                // After scroll completes, fade in text
                const t2 = setTimeout(() => {
                    setHeroRevealed(true);
                    heroScrollDone.current = true;
                }, 1200);
                return () => { clearTimeout(t1); clearTimeout(t2); };
            }, [page]);

            useEffect(() => {
                if (page !== 'home') return;
                const onScroll = () => setScrollY(window.scrollY || window.pageYOffset || 0);
                onScroll();
                window.addEventListener('scroll', onScroll, { passive: true });
                return () => window.removeEventListener('scroll', onScroll);
            }, [page]);

            // Reset scroll to top when navigating to a non-home page
            useEffect(() => {
                if (page === 'home') return;
                window.scrollTo(0, 0);
            }, [page]);

            useEffect(() => {
                const handleClickOutside = (e) => {
                    if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) setCatDropdownOpen(null);
                    if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) setFilterDropdownOpen(null);
                };
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
            }, []);

            // Collapse factor: 0 at top, 1 after ~400px
            const heroCollapse = Math.min(1, Math.max(0, scrollY / 400));

            const handleLogin = (e) => {
                e.preventDefault();
                if (email.trim()) {
                    setPage('home');
                }
            };

            const cartAutoCloseTimer = useRef(null);

            const handleAddToCart = (product, qtyByColor) => {
                setCart(prev => {
                    const existing = prev[product.id] || {};
                    const merged = { ...existing };
                    Object.entries(qtyByColor).forEach(([color, sizeQties]) => {
                        merged[color] = { ...(merged[color] || {}), ...sizeQties };
                    });
                    return { ...prev, [product.id]: merged };
                });
                // Auto-open drawer and close after 1.2s
                setCartDrawerOpen(true);
                if (cartAutoCloseTimer.current) clearTimeout(cartAutoCloseTimer.current);
                cartAutoCloseTimer.current = setTimeout(() => setCartDrawerOpen(false), 1200);
            };

            const handleRemoveFromCart = (productId) => {
                const newCart = { ...cart };
                delete newCart[productId];
                setCart(newCart);
            };

            const handleRemoveColorFromCart = (productId, colorName) => {
                setCart(prev => {
                    const existing = prev[productId];
                    if (!existing) return prev;
                    const { [colorName]: _removed, ...rest } = existing;
                    if (Object.keys(rest).length === 0) {
                        const newCart = { ...prev };
                        delete newCart[productId];
                        return newCart;
                    }
                    return { ...prev, [productId]: rest };
                });
            };

            const getCartStats = () => {
                let totalStyles = 0, totalQty = 0, totalAmount = 0;
                Object.entries(cart).forEach(([productId, colorQties]) => {
                    const product = PRODUCTS.find(p => p.id === productId);
                    if (product) {
                        let qty = 0;
                        // Count each color variant (with any qty > 0) as a separate style row
                        Object.values(colorQties).forEach(sizeQties => {
                            const colorQty = Object.values(sizeQties).reduce((a, b) => a + b, 0);
                            if (colorQty > 0) totalStyles += 1;
                            qty += colorQty;
                        });
                        totalQty += qty;
                        const wholesale = calculateWholesalePrice(product.retail_price_krw);
                        totalAmount += qty * wholesale;
                    }
                });
                return { totalStyles, totalQty, totalAmount };
            };

            // Newer products (higher P-id) come first
            const sortByRecency = (arr) => [...arr].sort((a, b) => {
                const ai = parseInt((a.id || '').replace(/[^0-9]/g, ''), 10) || 0;
                const bi = parseInt((b.id || '').replace(/[^0-9]/g, ''), 10) || 0;
                return bi - ai;
            });

            const getVisibleProducts = () => {
                const filtered = PRODUCTS.filter(p => p.is_visible).filter(p => {
                    if (selectedMainCats.length > 0) {
                        if (!selectedMainCats.includes(p.category)) return false;
                        const subs = selectedSubCats[p.category];
                        if (subs && subs.length > 0 && !subs.includes(p.sub_category)) return false;
                    }
                    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.style_no.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                    if (activeFilter === 'hero' && !p.is_hero) return false;
                    if (filterYear !== 'All' && p.season && p.season.year !== parseInt(filterYear)) return false;
                    if (filterSeason !== 'All' && p.season && p.season.season !== filterSeason) return false;
                    if (selectedGenders.length > 0 && !selectedGenders.includes(p.gender)) return false;
                    return true;
                });
                return sortByRecency(filtered);
            };

            const getNewProducts = () => {
                // Exclude specific products from the main "NEW" showcase (e.g., those with visually dim hero shots)
                const NEW_EXCLUDE = new Set(['P-023', 'P-024', 'P-044']);
                // Pinned products for specific NEW slots (1-indexed). Overrides the default slot occupant.
                const NEW_PINS = { 1: 'P-033', 3: 'P-031', 6: 'P-025' };
                const pinnedNewIds = new Set(Object.values(NEW_PINS));
                // Exclude products that are already featured in HERO section from NEW showcase
                const latest = PRODUCTS.filter(p => p.is_visible && !p.is_hero && !NEW_EXCLUDE.has(p.id) && !pinnedNewIds.has(p.id) && p.season && p.season.year === LATEST_SEASON.year && p.season.season === LATEST_SEASON.season);
                // Interleave order (1-indexed slot → desired gender)
                const order = ['Male', 'Female', 'Male', 'Female', 'Kids', 'Accessories', 'Female', 'Female', 'Kids', 'Accessories'];
                // Pins consume one slot of their slot's *designated* gender, not their own gender
                const quotas = { Male: 0, Female: 0, Kids: 0, Accessories: 0 };
                order.forEach((g, idx) => {
                    const slotIsPinned = NEW_PINS[idx + 1] != null;
                    if (!slotIsPinned) quotas[g] += 1;
                });
                const byGender = { Male: [], Female: [], Kids: [], Accessories: [] };
                sortByRecency(latest).forEach(p => { if (byGender[p.gender]) byGender[p.gender].push(p); });
                const picked = [];
                const pickedIds = new Set();
                Object.keys(quotas).forEach(g => {
                    byGender[g].slice(0, quotas[g]).forEach(p => { picked.push(p); pickedIds.add(p.id); });
                });
                // Fill any remaining slots if a bucket was short, prioritizing Male then Female then Kids then Accessories
                const fillOrder = ['Male', 'Female', 'Kids', 'Accessories'];
                const totalNeeded = 10 - Object.keys(NEW_PINS).length;
                while (picked.length < totalNeeded) {
                    let added = false;
                    for (const g of fillOrder) {
                        const next = byGender[g].find(p => !pickedIds.has(p.id));
                        if (next) { picked.push(next); pickedIds.add(next.id); added = true; if (picked.length >= totalNeeded) break; }
                    }
                    if (!added) break;
                }
                // Place pinned products at their designated slots first, then fill remaining slots per interleave order
                const buckets = { Male: [], Female: [], Kids: [], Accessories: [] };
                picked.forEach(p => buckets[p.gender].push(p));
                const interleaved = new Array(10).fill(null);
                Object.keys(NEW_PINS).forEach(slot => {
                    const idx = parseInt(slot, 10) - 1;
                    const pinProduct = PRODUCTS.find(p => p.id === NEW_PINS[slot]);
                    if (pinProduct) interleaved[idx] = pinProduct;
                });
                for (let i = 0; i < 10; i++) {
                    if (interleaved[i] != null) continue;
                    const g = order[i];
                    let next = buckets[g].shift();
                    if (!next) { for (const fg of fillOrder) { if (buckets[fg].length > 0) { next = buckets[fg].shift(); break; } } }
                    if (next) interleaved[i] = next;
                }
                return interleaved.filter(Boolean).slice(0, 10);
            };
            const getHeroProducts = () => {
                // Exclude specific products from the main HERO showcase (e.g., dim-background shots)
                const HERO_EXCLUDE = new Set(['P-016', 'P-023', 'P-024', 'P-040']);
                // Pinned products for specific HERO slots (1-indexed). Overrides season/gender quotas.
                const HERO_PINS = { 2: 'P-010', 3: 'P-001' };
                const pinnedIds = new Set(Object.values(HERO_PINS));
                const newIds = new Set(getNewProducts().map(p => p.id));
                // HERO should feature products from seasons OTHER than the current NEW season
                const isLatestSeason = (p) => p.season && p.season.year === LATEST_SEASON.year && p.season.season === LATEST_SEASON.season;
                // Remaining hero pool (non-current-season, not excluded, not in NEW, not pinned)
                const heroes = sortByRecency(PRODUCTS.filter(p => p.is_hero && p.is_visible && !newIds.has(p.id) && !HERO_EXCLUDE.has(p.id) && !isLatestSeason(p) && !pinnedIds.has(p.id)));
                // Fill remaining slots (gender-balanced best-effort)
                const byGender = { Male: [], Female: [], Kids: [], Accessories: [] };
                heroes.forEach(p => { if (byGender[p.gender]) byGender[p.gender].push(p); });
                const pinnedCount = Object.keys(HERO_PINS).length;
                const remaining = 5 - pinnedCount;
                const fillOrder = ['Male', 'Female', 'Kids', 'Accessories'];
                const filler = [];
                const fillerIds = new Set();
                while (filler.length < remaining) {
                    let added = false;
                    for (const g of fillOrder) {
                        const next = (byGender[g] || []).find(p => !fillerIds.has(p.id));
                        if (next) { filler.push(next); fillerIds.add(next.id); added = true; if (filler.length >= remaining) break; }
                    }
                    if (!added) break;
                }
                // Place pinned products at their designated slots; fill the rest with `filler` in order
                const result = new Array(5).fill(null);
                Object.keys(HERO_PINS).forEach(slot => {
                    const idx = parseInt(slot, 10) - 1;
                    const pinProduct = PRODUCTS.find(p => p.id === HERO_PINS[slot]);
                    if (pinProduct) result[idx] = pinProduct;
                });
                let fi = 0;
                for (let i = 0; i < 5; i++) {
                    if (result[i] == null && fi < filler.length) result[i] = filler[fi++];
                }
                return result.filter(Boolean);
            };

            const stats = getCartStats();

            if (page === 'login') {
                return (
                    <div className="login-container">
                        <div className="login-left">
                            <div className="login-left-bg" aria-hidden="true">
                                <video
                                    src="/videos/theman.webm"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    tabIndex={-1}
                                    onTimeUpdate={(e) => {
                                        if (e.target.currentTime >= 8) {
                                            e.target.currentTime = 0;
                                        }
                                    }}
                                ></video>
                            </div>
                            <div className="login-left-overlay" aria-hidden="true"></div>
                            <div className="login-logo">MUSINSA</div>
                            <div className="login-subtitle">GLOBAL B2B</div>
                        </div>
                        <div className="login-right">
                            <div className="login-form">
                                <div className="login-header">
                                    <span className="login-label">Partner Portal</span>
                                    <h2 className="login-h2">Access Portal</h2>
                                    <p className="login-subtitle-text">Enter your registered email</p>
                                </div>
                                <form onSubmit={handleLogin}>
                                    <div className="form-group">
                                        <label className="form-label">Business Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="partner@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn-black">Continue</button>
                                </form>
                                <div className="demo-accounts">
                                    <div className="demo-accounts-title">Demo Accounts</div>
                                    <div className="demo-email">partner@bangkok.com</div>
                                    <div className="demo-email">partner@metrading.com</div>
                                    <div className="demo-email">partner@sgdist.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // Pages with header
            return (
                <div style={{ minHeight: '100vh' }}>
                    <div className="header">
                        <div className="header-left">
                            <div className="logo" onClick={() => { setPage('home'); setSelectedProduct(null); setModalOpen(false); }}>
                                MUSINSA STANDARD
                                <div className="logo-small">B2B</div>
                            </div>
                        </div>
                        <div className="header-center">
                            <div className="nav">
                                {['home', 'products', 'orders'].map(navPage => (
                                    <div
                                        key={navPage}
                                        className={`nav-item ${page === navPage ? 'active' : ''}`}
                                        onClick={() => {
                                            setPage(navPage);
                                            setSelectedProduct(null);
                                            setModalOpen(false);
                                        }}
                                        style={{ display: 'inline-flex', alignItems: 'center' }}
                                    >
                                        {navPage === 'orders' ? 'My Orders' : navPage.charAt(0).toUpperCase() + navPage.slice(1)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="cart-icon-wrap" onClick={() => { setCartDrawerOpen(true); setSelectedProduct(null); setModalOpen(false); }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <path d="M16 10a4 4 0 01-8 0"/>
                                </svg>
                                {stats.totalStyles > 0 && <span className="cart-badge">{stats.totalStyles}</span>}
                            </div>
                            <button className="logout-btn" onClick={() => {
                                setPage('login');
                                setEmail('');
                            }}>Logout</button>
                            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <line x1="3" y1="12" x2="21" y2="12"/>
                                    <line x1="3" y1="18" x2="21" y2="18"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="header-spacer"></div>

                    {/* MOBILE DRAWER */}
                    <div className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
                    <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`} role="dialog" aria-hidden={!mobileMenuOpen}>
                        <div className="mobile-drawer-header">
                            <span className="mobile-drawer-title">MENU</span>
                            <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className="mobile-drawer-menu">
                            {['home', 'products', 'orders'].map(navPage => (
                                <div
                                    key={navPage}
                                    className={`mobile-drawer-item ${page === navPage ? 'active' : ''}`}
                                    onClick={() => {
                                        setPage(navPage);
                                        setSelectedProduct(null);
                                        setModalOpen(false);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    {navPage === 'orders' ? 'My Orders' : navPage.charAt(0).toUpperCase() + navPage.slice(1)}
                                </div>
                            ))}
                        </div>
                        <div className="mobile-drawer-footer">
                            <button className="btn-outline-black" style={{ width: '100%', padding: '10px 16px', fontSize: '13px' }} onClick={() => {
                                setPage('login');
                                setEmail('');
                                setMobileMenuOpen(false);
                            }}>Logout</button>
                        </div>
                    </div>

                    {/* CART DRAWER */}
                    <div className={`cart-drawer-backdrop ${cartDrawerOpen ? 'open' : ''}`} onClick={() => setCartDrawerOpen(false)}></div>
                    <div className={`cart-drawer ${cartDrawerOpen ? 'open' : ''}`} onMouseEnter={() => { if (cartAutoCloseTimer.current) { clearTimeout(cartAutoCloseTimer.current); cartAutoCloseTimer.current = null; } }} onTouchStart={() => { if (cartAutoCloseTimer.current) { clearTimeout(cartAutoCloseTimer.current); cartAutoCloseTimer.current = null; } }}>
                        <div className="cart-drawer-header">
                            <h3>Shopping Bag ({stats.totalStyles})</h3>
                            <button className="cart-drawer-close" onClick={() => setCartDrawerOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="cart-drawer-body">
                            {stats.totalQty === 0 ? (
                                <div className="cart-drawer-empty">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:'1rem'}}>
                                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                                    </svg>
                                    <p style={{fontSize:'14px',fontWeight:500}}>Your bag is empty</p>
                                    <p style={{fontSize:'12px',color:'#999'}}>Browse products and add to your bag</p>
                                </div>
                            ) : (
                                Object.entries(cart).flatMap(([productId, colorQties]) => {
                                    const product = PRODUCTS.find(p => p.id === productId);
                                    if (!product) return [];
                                    const wholesale = calculateWholesalePrice(product.retail_price_krw);
                                    return Object.entries(colorQties).map(([colorName, sizeQties]) => {
                                        const colorQty = Object.values(sizeQties).reduce((a,b) => a+b, 0);
                                        if (colorQty <= 0) return null;
                                        const colorObj = product.colors.find(c => c.name === colorName) || product.colors[0];
                                        const sizeStr = Object.entries(sizeQties).filter(([_,q]) => q > 0).map(([size,qty]) => `${size}: ${qty}`).join(', ');
                                        return (
                                            <div key={`${productId}-${colorName}`} className="cart-drawer-item">
                                                <img className="cart-drawer-item-img" src={colorObj.images[0]} alt={`${product.name} - ${colorName}`} />
                                                <div className="cart-drawer-item-info">
                                                    <div className="cart-drawer-item-name">{product.name}</div>
                                                    <div className="cart-drawer-item-meta">{product.style_no} · {colorName}</div>
                                                    <div className="cart-drawer-item-sizes">{sizeStr}</div>
                                                    <div className="cart-drawer-item-bottom">
                                                        <span className="cart-drawer-item-qty">QTY: {colorQty}</span>
                                                        <span className="cart-drawer-item-price">{formatUSD(colorQty * wholesale)}</span>
                                                    </div>
                                                </div>
                                                <button className="cart-drawer-item-remove" onClick={() => handleRemoveColorFromCart(productId, colorName)}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                                </button>
                                            </div>
                                        );
                                    }).filter(Boolean);
                                })
                            )}
                        </div>
                        {stats.totalQty > 0 && (
                            <div className="cart-drawer-footer">
                                <div className="cart-drawer-subtotal">
                                    <div className="cart-drawer-stats">
                                        <span><em>STYLES</em>{stats.totalStyles}</span>
                                        <span><em>QTY</em>{stats.totalQty}</span>
                                    </div>
                                    <span className="cart-drawer-total-amount"><em>TOTAL</em>{formatUSD(stats.totalAmount)}</span>
                                </div>
                                <div className="cart-drawer-actions">
                                    <button className="btn-black" onClick={() => { setCartDrawerOpen(false); setPage('confirm'); }}>PROCEED TO ORDER</button>
                                    <button className="btn-outline-black" onClick={() => { if (confirm('쇼핑백의 모든 상품을 삭제하시겠습니까?')) setCart({}); }}>CLEAR ALL</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* HOME PAGE */}
                    {page === 'home' && (
                        <div className="page">
                            <div
                                className={`hero-section ${heroRevealed ? 'hero-revealed' : ''}`}
                                style={{
                                    minHeight: `${56 - 28 * heroCollapse}vh`,
                                    paddingTop: `${4 - 2 * heroCollapse}rem`,
                                    paddingBottom: `${4 - 2 * heroCollapse}rem`,
                                }}
                            >
                                <div className="hero-bg" aria-hidden="true">
                                    <video
                                        src="/videos/musinsa-cooltandard-1080p.webm"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                        tabIndex={-1}
                                    ></video>
                                </div>
                                <div className="hero-overlay" aria-hidden="true"></div>
                                <div className="hero-label">2027 S/S COLLECTION</div>
                                <div className="hero-title">MUSINSA STANDARD<br />GLOBAL SHOWROOM</div>
                                <div className="hero-subtitle">Explore our latest collection and place your wholesale orders</div>
                                <button className="btn-white" onClick={() => setPage('products')}>View All Products</button>
                            </div>

                            {/* CATEGORY BANNERS */}
                            <div className="category-banners">
                                <div className="cat-banner" onClick={() => { setSelectedGenders(['Male']); setSelectedMainCats([]); setSelectedSubCats({}); setFilterYear('All'); setFilterSeason('All'); setActiveFilter('all'); setSearchTerm(''); setPage('products'); }}>
                                    <img src="/images/banners/Frame 1739342240.png" alt="Male Collection" />
                                    <div className="cat-banner-overlay">
                                        <div className="cat-banner-heading--inline">
                                            <div className="cat-banner-title">MALE</div>
                                            <div className="cat-banner-subtitle">COLLECTION</div>
                                        </div>
                                        <div className="cat-banner-cta">SHOP NOW</div>
                                    </div>
                                </div>
                                <div className="cat-banner" onClick={() => { setSelectedGenders(['Female']); setSelectedMainCats([]); setSelectedSubCats({}); setFilterYear('All'); setFilterSeason('All'); setActiveFilter('all'); setSearchTerm(''); setPage('products'); }}>
                                    <img src="/images/banners/Frame 1739342239.png" alt="Female Collection" />
                                    <div className="cat-banner-overlay">
                                        <div className="cat-banner-heading--inline">
                                            <div className="cat-banner-title">FEMALE</div>
                                            <div className="cat-banner-subtitle">COLLECTION</div>
                                        </div>
                                        <div className="cat-banner-cta">SHOP NOW</div>
                                    </div>
                                </div>
                                <div className="cat-banner" onClick={() => { setSelectedGenders(['Kids']); setSelectedMainCats([]); setSelectedSubCats({}); setFilterYear('All'); setFilterSeason('All'); setActiveFilter('all'); setSearchTerm(''); setPage('products'); }}>
                                    <img src="/images/banners/Frame 1739342236.png" alt="Kids Collection" />
                                    <div className="cat-banner-overlay">
                                        <div className="cat-banner-title">KIDS</div>
                                        <div className="cat-banner-subtitle">COLLECTION</div>
                                        <div className="cat-banner-cta">SHOP NOW</div>
                                    </div>
                                </div>
                                <div className="cat-banner" onClick={() => { setSelectedMainCats(['Accessories']); setSelectedSubCats({}); setSelectedGenders([]); setFilterYear('All'); setFilterSeason('All'); setActiveFilter('all'); setSearchTerm(''); setPage('products'); }}>
                                    <img src="/images/banners/Frame 1739342238.png" alt="Accessories Collection" />
                                    <div className="cat-banner-overlay">
                                        <div className="cat-banner-title">ACCESSORIES</div>
                                        <div className="cat-banner-subtitle">COLLECTION</div>
                                        <div className="cat-banner-cta">SHOP NOW</div>
                                    </div>
                                </div>
                                <div className="cat-banner" onClick={() => { setSelectedMainCats([]); setSelectedSubCats({}); setSelectedGenders([]); setFilterYear('All'); setFilterSeason('Special'); setActiveFilter('all'); setSearchTerm(''); setPage('products'); }}>
                                    <img src="/images/banners/Frame 1739342241.png" alt="Special Collection" />
                                    <div className="cat-banner-overlay">
                                        <div className="cat-banner-title">SPECIAL</div>
                                        <div className="cat-banner-subtitle">COLLECTION</div>
                                        <div className="cat-banner-cta">SHOP NOW</div>
                                    </div>
                                </div>
                            </div>

                            <div className="collections-section">
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                                        <h3 className="section-title" style={{ margin: 0 }}>New Arrivals — 27 S/S</h3>
                                        <span style={{ color: '#888', fontSize: '16px' }}>{PRODUCTS.filter(p => p.is_visible && p.season && p.season.year === LATEST_SEASON.year && p.season.season === LATEST_SEASON.season).length} items</span>
                                    </div>
                                    <button onClick={() => { setFilterYear(String(LATEST_SEASON.year)); setFilterSeason(LATEST_SEASON.season); setActiveFilter('all'); setPage('products'); }} style={{ background: 'none', border: 'none', color: '#888', fontSize: '16px', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>View all</button>
                                </div>
                                <div className="product-grid">
                                    {getNewProducts().slice(0, 5).map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onSelect={(p) => {
                                                setSelectedProduct(p);
                                                setModalOpen(true);
                                                setEditingProduct(null);
                                            }}
                                            cartQty={cart[product.id] ? Object.values(cart[product.id]).reduce((colorSum, sizeQties) => colorSum + Object.values(sizeQties).reduce((a, b) => a + b, 0), 0) : 0}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="collections-section">
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                                        <h3 className="section-title" style={{ margin: 0 }}>HERO PRODUCTS</h3>
                                        <span style={{ color: '#888', fontSize: '16px' }}>{PRODUCTS.filter(p => p.is_hero && p.is_visible).length} items</span>
                                    </div>
                                    <button onClick={() => { setActiveFilter('hero'); setPage('products'); }} style={{ background: 'none', border: 'none', color: '#888', fontSize: '16px', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>View all</button>
                                </div>
                                <div className="product-grid">
                                    {getHeroProducts().map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onSelect={(p) => {
                                                setSelectedProduct(p);
                                                setModalOpen(true);
                                                setEditingProduct(null);
                                            }}
                                            cartQty={cart[product.id] ? Object.values(cart[product.id]).reduce((colorSum, sizeQties) => colorSum + Object.values(sizeQties).reduce((a, b) => a + b, 0), 0) : 0}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Modal for Home page */}
                            {selectedProduct && modalOpen && (
                                <ProductDetailModal
                                    product={selectedProduct}
                                    isOpen={modalOpen}
                                    onClose={() => {
                                        setModalOpen(false);
                                        setSelectedProduct(null);
                                    }}
                                    onAddToCart={handleAddToCart}
                                    isEditMode={false}
                                />
                            )}
                        </div>
                    )}

                    {/* PRODUCTS PAGE */}
                    {page === 'products' && (
                        <div className="page" style={{ paddingBottom: stats.totalStyles > 0 ? '4rem' : 0 }}>
                            <div className="products-title-row" style={{ maxWidth: '1980px', margin: '0 auto', padding: 'clamp(16px, 2vw, 32px) 1.5rem 0' }}>
                                <h2 style={{ marginBottom: 0 }}>Products</h2>
                                <button className="search-toggle search-toggle-mobile" onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchTerm(''); }} aria-label="Toggle search">
                                    {showSearch ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    )}
                                </button>
                            </div>
                            <div className="filters-sticky">
                            {(catDropdownOpen || filterDropdownOpen) && <div className="cat-multi-dropdown-backdrop" onClick={() => { setCatDropdownOpen(null); setFilterDropdownOpen(null); }}></div>}
                            <div className={`filters-row ${catDropdownOpen || filterDropdownOpen ? 'dropdown-open' : ''}`}>
                                <div className="category-buttons" ref={catDropdownRef} style={{position:'relative'}}>
                                    {[...new Set(PRODUCTS.filter(p => p.is_visible).map(p => p.category))].map(cat => {
                                        const isActive = selectedMainCats.includes(cat);
                                        const subs = [...new Set(PRODUCTS.filter(p => p.is_visible && p.category === cat).map(p => p.sub_category).filter(Boolean))];
                                        const catSubs = selectedSubCats[cat] || [];
                                        return (
                                            <div key={cat} className="cat-multi-select">
                                                <button className={`category-btn ${isActive ? 'active' : ''}`}
                                                    onClick={() => setCatDropdownOpen(catDropdownOpen === cat ? null : cat)}>
                                                    {cat}
                                                    {isActive && catSubs.length > 0 && <span style={{fontSize:'11px',marginLeft:'4px',opacity:0.85}}>({catSubs.length})</span>}
                                                    {subs.length > 0 && (
                                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{marginLeft:'6px',opacity: isActive ? 1 : 0.5,transform: catDropdownOpen === cat ? 'rotate(180deg)' : 'none',transition:'transform 0.15s, opacity 0.15s'}}>
                                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    )}
                                                </button>
                                                {catDropdownOpen === cat && subs.length > 0 && (() => {
                                                    const allChecked = catSubs.length === subs.length;
                                                    return (
                                                    <div className="cat-multi-dropdown">
                                                        <div className="cat-multi-option" style={{justifyContent:'space-between'}} onClick={() => {
                                                            if (allChecked) {
                                                                // deselect all → also remove major category
                                                                setSelectedSubCats(prev => ({ ...prev, [cat]: [] }));
                                                                setSelectedMainCats(prev => prev.filter(c => c !== cat));
                                                                setCatDropdownOpen(null);
                                                            } else {
                                                                setSelectedSubCats(prev => ({ ...prev, [cat]: [...subs] }));
                                                                setSelectedMainCats(prev => prev.includes(cat) ? prev : [...prev, cat]);
                                                            }
                                                        }}>
                                                            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                                                                <div className={`cat-multi-check ${allChecked ? 'checked' : ''}`}>{allChecked ? '✓' : ''}</div>
                                                                <span style={{fontWeight:600}}>All</span>
                                                            </div>
                                                            {catSubs.length > 0 && (
                                                                <button className="cat-multi-reset" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedSubCats(prev => ({ ...prev, [cat]: [] }));
                                                                    setSelectedMainCats(prev => prev.filter(c => c !== cat));
                                                                    setCatDropdownOpen(null);
                                                                }} title="Reset">
                                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="cat-multi-divider"></div>
                                                        {subs.map(sub => {
                                                            const checked = catSubs.includes(sub);
                                                            return (
                                                                <div key={sub} className="cat-multi-option" onClick={() => {
                                                                    const next = checked ? catSubs.filter(v => v !== sub) : [...catSubs, sub];
                                                                    setSelectedSubCats(prev => ({ ...prev, [cat]: next }));
                                                                    if (checked && next.length === 0) {
                                                                        setSelectedMainCats(prev => prev.filter(c => c !== cat));
                                                                        setCatDropdownOpen(null);
                                                                    } else if (!checked) {
                                                                        setSelectedMainCats(prev => prev.includes(cat) ? prev : [...prev, cat]);
                                                                    }
                                                                }}>
                                                                    <div className={`cat-multi-check ${checked ? 'checked' : ''}`}>{checked ? '✓' : ''}</div>
                                                                    {sub}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    );
                                                })()}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="filter-divider"></div>

                                <div className="category-buttons">
                                    {['Male', 'Female', 'Kids', 'Accessories'].map(g => {
                                        const isOn = selectedGenders.includes(g);
                                        return (
                                            <button
                                                key={g}
                                                className={`category-btn ${isOn ? 'active' : ''}`}
                                                onClick={() => setSelectedGenders(isOn ? [] : [g])}
                                            >
                                                {g}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="filter-divider"></div>

                                <div ref={filterDropdownRef} style={{display:'inline-flex',gap:'0.375rem'}}>
                                    <div className="cat-multi-select">
                                        <button
                                            className={`category-btn ${filterYear !== 'All' ? 'active' : ''}`}
                                            onClick={() => setFilterDropdownOpen(filterDropdownOpen === 'year' ? null : 'year')}
                                        >
                                            {filterYear === 'All' ? 'Year' : filterYear}
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{marginLeft:'6px',opacity: filterYear !== 'All' ? 1 : 0.5,transform: filterDropdownOpen === 'year' ? 'rotate(180deg)' : 'none',transition:'transform 0.15s, opacity 0.15s'}}>
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                        {filterDropdownOpen === 'year' && (
                                            <div className="cat-multi-dropdown">
                                                <div className="cat-multi-option" onClick={() => { setFilterYear('All'); setFilterDropdownOpen(null); }} style={{fontWeight: filterYear === 'All' ? 600 : 400}}>
                                                    All
                                                </div>
                                                {['2027','2026','2025'].map(y => {
                                                    const checked = filterYear === y;
                                                    return (
                                                        <div key={y} className="cat-multi-option" onClick={() => { setFilterYear(checked ? 'All' : y); setFilterDropdownOpen(null); }} style={{fontWeight: checked ? 600 : 400}}>
                                                            {y}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <div className="cat-multi-select">
                                        <button
                                            className={`category-btn ${filterSeason !== 'All' ? 'active' : ''}`}
                                            onClick={() => setFilterDropdownOpen(filterDropdownOpen === 'season' ? null : 'season')}
                                        >
                                            {filterSeason === 'All' ? 'Season' : filterSeason}
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{marginLeft:'6px',opacity: filterSeason !== 'All' ? 1 : 0.5,transform: filterDropdownOpen === 'season' ? 'rotate(180deg)' : 'none',transition:'transform 0.15s, opacity 0.15s'}}>
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                        {filterDropdownOpen === 'season' && (
                                            <div className="cat-multi-dropdown">
                                                <div className="cat-multi-option" onClick={() => { setFilterSeason('All'); setFilterDropdownOpen(null); }} style={{fontWeight: filterSeason === 'All' ? 600 : 400}}>
                                                    All
                                                </div>
                                                {['S/S','F/W','Special','Carry Over'].map(s => {
                                                    const checked = filterSeason === s;
                                                    return (
                                                        <div key={s} className="cat-multi-option" onClick={() => { setFilterSeason(checked ? 'All' : s); setFilterDropdownOpen(null); }} style={{fontWeight: checked ? 600 : 400}}>
                                                            {s}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="filter-divider"></div>

                                <button
                                    className={`category-btn ${activeFilter === 'hero' ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(activeFilter === 'hero' ? 'all' : 'hero')}
                                >
                                    HERO
                                </button>

                                {(selectedMainCats.length > 0 || selectedGenders.length > 0 || filterYear !== 'All' || filterSeason !== 'All' || activeFilter !== 'all') && (
                                    <button className="filter-reset" onClick={() => {
                                        setSelectedMainCats([]);
                                        setSelectedSubCats({});
                                        setSelectedGenders([]);
                                        setFilterYear('All');
                                        setFilterSeason('All');
                                        setActiveFilter('all');
                                    }}>Reset</button>
                                )}

                                <div className="filters-right">
                                    <button className="search-toggle" onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchTerm(''); }}>
                                        {showSearch ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        )}
                                    </button>
                                    {showSearch && (
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Search style no. or name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            autoFocus
                                        />
                                    )}
                                </div>
                            </div>
                            {showSearch && (
                                <div className="mobile-search-row" style={{padding:'0.5rem 1rem 0.75rem'}}>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search style no. or name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                        style={{width:'100%'}}
                                    />
                                </div>
                            )}
                            </div>

                            <div className="products-section">
                                {getVisibleProducts().length === 0 ? (
                                    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem', textAlign: 'center', minHeight: 'calc(100vh - 12rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2rem' }}>
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            <line x1="8" y1="11" x2="14" y2="11"></line>
                                        </svg>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-fg)' }}>No products found</h2>
                                        <p style={{ color: '#888', marginBottom: '2rem' }}>Try adjusting your filters to find what you're looking for.</p>
                                        <button className="btn-black" style={{ width: 'auto', padding: '10px 24px', fontSize: '13px' }} onClick={() => { setSelectedMainCats([]); setSelectedSubCats({}); setSelectedGenders([]); setFilterYear('All'); setFilterSeason('All'); setActiveFilter('all'); setSearchTerm(''); }}>Reset Filters</button>
                                    </div>
                                ) : (
                                    <div className="product-grid">
                                        {getVisibleProducts().map(product => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onSelect={(p) => {
                                                    setSelectedProduct(p);
                                                    setModalOpen(true);
                                                    setEditingProduct(null);
                                                }}
                                                cartQty={cart[product.id] ? Object.values(cart[product.id]).reduce((colorSum, sizeQties) => colorSum + Object.values(sizeQties).reduce((a, b) => a + b, 0), 0) : 0}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {stats.totalStyles > 0 && (
                                <div className="summary-bar">
                                    <div className="summary-bar-inner">
                                        <div className="summary-stats">
                                            <div className="stat">
                                                <span className="stat-label">STYLES</span>
                                                <span>{stats.totalStyles}</span>
                                            </div>
                                            <div className="stat">
                                                <span className="stat-label">QTY</span>
                                                <span>{stats.totalQty}</span>
                                            </div>
                                            <div className="stat">
                                                <span className="stat-label">TOTAL</span>
                                                <span>{formatUSD(stats.totalAmount)}</span>
                                            </div>
                                        </div>
                                        <button className="btn-outline-white view-bag-btn" onClick={() => setCartDrawerOpen(true)}>
                                            <span>VIEW BAG</span>
                                            <span className="view-bag-count">{stats.totalStyles}</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedProduct && (
                                <ProductDetailModal
                                    product={selectedProduct}
                                    isOpen={modalOpen}
                                    onClose={() => {
                                        setModalOpen(false);
                                        setSelectedProduct(null);
                                    }}
                                    onAddToCart={handleAddToCart}
                                    isEditMode={false}
                                />
                            )}
                        </div>
                    )}

                    {/* CONFIRM ORDER PAGE */}
                    {page === 'confirm' && !orderSubmitted && (
                        <div className="page">
                            <div className="confirm-view">
                                <div className="confirm-title-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
                                    <h2 style={{ margin: 0 }}>Order Confirmation</h2>
                                    <button
                                        className="btn-outline-black confirm-download-btn"
                                        style={{ fontSize: '12px', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                                        onClick={() => exportCartToExcel(cart)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        EXCEL
                                    </button>
                                </div>
                                <div className="confirm-table-scroll">
                                <table className="confirm-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '48px' }}>No.</th>
                                            <th>Product</th>
                                            <th>Style No</th>
                                            <th>Color</th>
                                            <th>Size</th>
                                            <th>Qty</th>
                                            <th>Unit Price</th>
                                            <th>Subtotal</th>
                                            <th style={{ width: '40px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const rows = [];
                                            Object.entries(cart).forEach(([productId, colorQties]) => {
                                                const product = PRODUCTS.find(p => p.id === productId);
                                                if (!product) return;
                                                const wholesale = calculateWholesalePrice(product.retail_price_krw);
                                                Object.entries(colorQties).forEach(([colorName, sizeQties]) => {
                                                    Object.entries(sizeQties).forEach(([size, qty]) => {
                                                        if (qty > 0) rows.push({ productId, product, wholesale, colorName, size, qty });
                                                    });
                                                });
                                            });
                                            return rows.map(({ productId, product, wholesale, colorName, size, qty }, idx) => (
                                                    <tr key={`${productId}-${colorName}-${size}`}>
                                                        <td className="row-no-cell">{idx + 1}</td>
                                                        <td>
                                                            <div className="product-cell">
                                                                <div className="product-cell-image">
                                                                    <img src={product.colors[0].images[0]} alt={product.name} />
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                                    {product.name}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{product.style_no}</td>
                                                        <td>{colorName}</td>
                                                        <td>{size}</td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={qty}
                                                                onChange={(e) => {
                                                                    const newQty = Math.max(0, parseInt(e.target.value) || 0);
                                                                    if (newQty === 0) {
                                                                        const newColorQties = { ...cart[productId][colorName] };
                                                                        delete newColorQties[size];
                                                                        if (Object.keys(newColorQties).length === 0) {
                                                                            const newAllColors = { ...cart[productId] };
                                                                            delete newAllColors[colorName];
                                                                            if (Object.keys(newAllColors).length === 0) {
                                                                                handleRemoveFromCart(productId);
                                                                            } else {
                                                                                setCart(prev => ({ ...prev, [productId]: newAllColors }));
                                                                            }
                                                                        } else {
                                                                            setCart(prev => ({ ...prev, [productId]: { ...prev[productId], [colorName]: newColorQties } }));
                                                                        }
                                                                    } else {
                                                                        setCart(prev => ({
                                                                            ...prev,
                                                                            [productId]: { ...prev[productId], [colorName]: { ...prev[productId][colorName], [size]: newQty } }
                                                                        }));
                                                                    }
                                                                }}
                                                                className="qty-input-small"
                                                            />
                                                        </td>
                                                        <td>{formatUSD(wholesale)}</td>
                                                        <td>{formatUSD(qty * wholesale)}</td>
                                                        <td>
                                                            <button
                                                                className="row-delete-btn"
                                                                aria-label="Remove item"
                                                                title="Remove item"
                                                                onClick={() => {
                                                                    const newColorQties = { ...cart[productId][colorName] };
                                                                    delete newColorQties[size];
                                                                    if (Object.keys(newColorQties).length === 0) {
                                                                        const newAllColors = { ...cart[productId] };
                                                                        delete newAllColors[colorName];
                                                                        if (Object.keys(newAllColors).length === 0) {
                                                                            handleRemoveFromCart(productId);
                                                                        } else {
                                                                            setCart(prev => ({ ...prev, [productId]: newAllColors }));
                                                                        }
                                                                    } else {
                                                                        setCart(prev => ({ ...prev, [productId]: { ...prev[productId], [colorName]: newColorQties } }));
                                                                    }
                                                                }}
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                            ));
                                        })()}
                                    </tbody>
                                </table>
                                </div>

                                <div className="checkout-footer">
                                <div className="totals-row">
                                    <div className="total-item">
                                        <div className="total-label">Total Styles</div>
                                        <div className="total-value">{stats.totalStyles}</div>
                                    </div>
                                    <div className="total-item">
                                        <div className="total-label">Total Quantity</div>
                                        <div className="total-value">{stats.totalQty}</div>
                                    </div>
                                    <div className="total-item">
                                        <div className="total-label">Total Amount</div>
                                        <div className="total-value">{formatUSD(stats.totalAmount)}</div>
                                    </div>
                                </div>

                                <div className="confirm-buttons">
                                    <button className="btn-outline-black" style={{ whiteSpace: 'nowrap' }} onClick={() => { setPage('products'); setCartDrawerOpen(true); }}>Back to Bag</button>
                                    <button className="btn-black" onClick={() => {
                                        const stats = getCartStats();
                                        const orderItems = [];
                                        Object.entries(cart).forEach(([productId, colorQties]) => {
                                            const product = PRODUCTS.find(p => p.id === productId);
                                            if (!product) return;
                                            const wholesalePrice = calculateWholesalePrice(product.retail_price_krw);
                                            Object.entries(colorQties).forEach(([colorName, sizeQties]) => {
                                                Object.entries(sizeQties).forEach(([size, qty]) => {
                                                    if (qty > 0) {
                                                        orderItems.push({
                                                            product,
                                                            color: colorName,
                                                            size,
                                                            qty,
                                                            unit_price: wholesalePrice,
                                                            subtotal: Math.round(qty * wholesalePrice * 100) / 100
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                        const newOrder = {
                                            order_id: 'ORD-2026-' + String(orders.length + 1).padStart(4, '0'),
                                            partner_id: CURRENT_PARTNER.partner_id,
                                            partner_name: CURRENT_PARTNER.company,
                                            status: '주문접수',
                                            rejection_reason: null,
                                            total_qty: stats.totalQty,
                                            total_amount: stats.totalAmount,
                                            items: orderItems,
                                            created_at: new Date().toISOString(),
                                            updated_at: new Date().toISOString()
                                        };
                                        setOrders(prev => [...prev, newOrder]);
                                        setCart({});
                                        setOrderSubmitted(true);
                                    }}>Submit Order</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ORDER SUCCESS PAGE */}
                    {page === 'confirm' && orderSubmitted && (
                        <div className="page">
                            <div className="confirm-view">
                                <div className="success-screen">
                                    <svg className="success-icon" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="8 12 11 15 16 9"></polyline>
                                    </svg>
                                    <div className="success-title">Order Submitted</div>
                                    <div className="success-order-no">Order No. {orders.length > 0 ? orders[orders.length - 1].order_id : ''}</div>
                                    <div className="success-buttons">
                                        <button className="btn-outline-black" onClick={() => {
                                            setPage('products');
                                            setOrderSubmitted(false);
                                            setCart({});
                                        }}>Continue Shopping</button>
                                        <button className="btn-black" onClick={() => {
                                            setPage('orders');
                                            setOrderSubmitted(false);
                                        }}>View My Orders</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ORDERS PAGE */}
                    {page === 'orders' && (
                        <div className="page">
                            <div className="orders-section">
                                <h2 style={{ margin: '0 0 2rem 0' }}>My Orders</h2>
                                {orders.filter(o => o.partner_id === CURRENT_PARTNER.partner_id).length === 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 12rem)', textAlign: 'center', color: 'var(--color-fg-low)' }}>
                                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2rem' }}>
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                        </svg>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-fg)' }}>No orders yet</h2>
                                        <p style={{ color: '#888', marginBottom: '2rem' }}>Browse our collection and place your first wholesale order.</p>
                                        <button className="btn-black" style={{ width: 'auto', padding: '10px 24px', fontSize: '13px' }} onClick={() => setPage('products')}>Browse Products</button>
                                    </div>
                                ) : null}
                                {orders.filter(o => o.partner_id === CURRENT_PARTNER.partner_id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(order => {
                                    const statusMap = {
                                        '주문접수': 'Pending',
                                        '주문승인': 'Approved',
                                        '반려': 'Rejected'
                                    };
                                    const statusClassMap = {
                                        '주문접수': 'status-pending',
                                        '주문승인': 'status-approved',
                                        '반려': 'status-rejected'
                                    };

                                    const uniqueThumbnails = [];
                                    const seenStyleNos = new Set();
                                    (order.items || []).forEach(item => {
                                        const styleNo = item.product && item.product.style_no;
                                        const img = item.product && item.product.images && item.product.images[0];
                                        if (styleNo && img && !seenStyleNos.has(styleNo)) {
                                            seenStyleNos.add(styleNo);
                                            uniqueThumbnails.push({ img, name: item.product.name });
                                        }
                                    });
                                    const MAX_THUMBS = 2;
                                    const visibleThumbs = uniqueThumbnails.slice(0, MAX_THUMBS);
                                    const remainingCount = uniqueThumbnails.length - visibleThumbs.length;

                                    return (
                                        <div key={order.order_id} className="order-card">
                                            <div className="order-thumbnails">
                                                {visibleThumbs.map((t, i) => (
                                                    <img key={i} className="order-thumbnail" src={t.img} alt={t.name} />
                                                ))}
                                                {remainingCount > 0 && (
                                                    <div className="order-thumbnail-more">+{remainingCount}</div>
                                                )}
                                            </div>
                                            <div className="order-info-grid">
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Order Number</div>
                                                    <div className="order-info-value regular">{order.order_id}</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Order Date</div>
                                                    <div className="order-info-value regular">{formatDateTime(order.created_at)}</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Last Updated</div>
                                                    <div className="order-info-value regular">{formatDateTime(order.updated_at)}</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Total Quantity</div>
                                                    <div className="order-info-value">{order.total_qty} units</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Total Amount</div>
                                                    <div className="order-info-value">{formatUSD(order.total_amount)}</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Status</div>
                                                    <div className="order-info-value">
                                                        <span className={`status-badge ${statusClassMap[order.status]}`}>{statusMap[order.status]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="order-card-actions">
                                                <button className="order-card-button" onClick={() => exportOrderToExcel(order)}>Excel</button>
                                                <button className="order-card-button" onClick={() => setSelectedOrder(order)}>View Details</button>
                                            </div>
                                            {order.rejection_reason && (
                                                <div className="rejection-reason">
                                                    <strong>Rejection Reason:</strong> {order.rejection_reason}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {orders.filter(o => o.partner_id === CURRENT_PARTNER.partner_id).length >= 2 && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                        <button className="btn-outline-black" style={{ fontSize: '12px', padding: '8px 16px' }} onClick={() => {
                                            const mine = orders.filter(o => o.partner_id === CURRENT_PARTNER.partner_id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                                            exportAllOrdersToExcel(mine);
                                        }}>EXPORT ALL (EXCEL)</button>
                                    </div>
                                )}
                            </div>

                            {/* Order Detail Modal */}
                            {selectedOrder && (() => {
                                const statusMap = { '주문접수': 'Pending', '주문승인': 'Approved', '반려': 'Rejected' };
                                const statusClassMap = { '주문접수': 'status-pending', '주문승인': 'status-approved', '반려': 'status-rejected' };
                                return (
                                <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
                                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                                        <div className="modal-header">
                                            <h2 className="modal-title">{selectedOrder.order_id}</h2>
                                            <button className="modal-close" onClick={() => setSelectedOrder(null)} aria-label="Close">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            </button>
                                        </div>
                                        <div className="modal-body order-detail-modal-body">
                                            <div className="order-detail-info">
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Order Number</div>
                                                    <div className="order-info-value">{selectedOrder.order_id}</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Order Date</div>
                                                    <div className="order-info-value">{formatDateTime(selectedOrder.created_at)}</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Last Updated</div>
                                                    <div className="order-info-value">{formatDateTime(selectedOrder.updated_at)}</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Total Quantity</div>
                                                    <div className="order-info-value">{selectedOrder.total_qty} units</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Total Amount</div>
                                                    <div className="order-info-value">{formatUSD(selectedOrder.total_amount)}</div>
                                                </div>
                                                <div className="order-info-item">
                                                    <div className="order-info-label">Status</div>
                                                    <div className="order-info-value">
                                                        <span className={`status-badge ${statusClassMap[selectedOrder.status]}`}>
                                                            {statusMap[selectedOrder.status]}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedOrder.rejection_reason && (
                                                <div className="rejection-reason">
                                                    <strong>Rejection Reason:</strong> {selectedOrder.rejection_reason}
                                                </div>
                                            )}

                                            <div className="order-items-table-wrap">
                                            <table className="order-items-table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '48px' }}>No.</th>
                                                        <th>Product</th>
                                                        <th>Style No</th>
                                                        <th>Color</th>
                                                        <th>Size</th>
                                                        <th>Qty</th>
                                                        <th>Unit Price</th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(selectedOrder.items || []).map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td className="row-no-cell">{idx + 1}</td>
                                                            <td>
                                                                <div className="product-cell">
                                                                    <div className="product-cell-image">
                                                                        <img src={item.product.images[0]} alt={item.product.name} />
                                                                    </div>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                                        {item.product.name}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{item.product.style_no}</td>
                                                            <td>{item.color || '—'}</td>
                                                            <td>{item.size}</td>
                                                            <td>{item.qty}</td>
                                                            <td>${item.unit_price.toFixed(2)}</td>
                                                            <td>${item.subtotal.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan="5" style={{ textAlign: 'right' }}>Total</td>
                                                        <td>{selectedOrder.total_qty}</td>
                                                        <td></td>
                                                        <td>{formatUSD(selectedOrder.total_amount)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            );
        };


export default App;
