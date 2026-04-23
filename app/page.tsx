import { QrGenerator } from "@/components/qr-generator/QrGenerator";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true" />
          <span className={styles.brandName}>QR Converter</span>
        </div>
        <p className={styles.tagline}>
          URL을 붙여넣으면 즉시 QR 코드가 생성됩니다. SVG 또는 PNG로
          다운로드하세요.
        </p>
      </header>

      <QrGenerator />

      <footer className={styles.footer}>
        <span>전부 브라우저에서 처리됩니다 — 서버에 URL이 전송되지 않습니다.</span>
      </footer>
    </main>
  );
}
