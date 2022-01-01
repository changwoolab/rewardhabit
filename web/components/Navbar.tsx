import React from 'react'
import { Nav, Button } from 'react-bootstrap';
import Link from 'next/link'
import styles from '../styles/navbar.module.css'

export default function Navbar() {
  // 1. Not logged in

  // 2. logged in
  return (
    <Nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className={styles.navbarContainer}>
      <Link href="/">
        <a className="navbar-brand">보상습관</a>
      </Link>
        <Link href="/">
          <a className="nav-link">Home <span className="sr-only">(current)</span></a>
        </Link>
        <Link href="/articles">
          <a className="nav-link">일기쓰기</a>
        </Link>
        <Link href="/write">
          <a className="nav-link">독서록쓰기</a>
        </Link>
        <Button className="nav-link">
            로그인
        </Button>
    </div>
  </Nav>
  )
}