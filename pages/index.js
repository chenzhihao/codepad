import React from 'react';
import Link from 'next/link';

export default () => (
  <ul>
    <li><Link href='/a' as='/a'><a>a</a></Link></li>
  </ul>
)