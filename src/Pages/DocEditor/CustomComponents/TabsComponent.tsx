import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import React, { useState, useEffect } from "react";

// Komponen untuk setiap tab individual
export function TabComponent({
  node,
  editor,
  getPos,
  selected,
}: NodeViewProps) {
  const [isActiveTab, setIsActiveTab] = useState(false);

  useEffect(() => {
    if (!editor || !getPos) return;

    const updateVisibility = () => {
      const { doc } = editor.state;
      // Resolve posisi node 'tab' saat ini.
      // $pos akan memberikan informasi tentang node ini dan konteksnya di dalam dokumen.
      const $pos = doc.resolve(getPos());

      // Node parent dari node 'tab' ini seharusnya adalah node 'tabs'.
      const parentNode = $pos.parent;

      if (parentNode.type.name === "tabs") {
        // Ambil atribut 'active' dari node 'tabs' parent.
        const parentActiveIndex = parentNode.attrs.active || 0;
        // Ambil indeks node 'tab' ini di antara saudara-saudaranya (anak-anak dari node 'tabs').
        const currentTabIndex = $pos.index();

        // Atur state isActiveTab berdasarkan perbandingan indeks.
        setIsActiveTab(currentTabIndex === parentActiveIndex);
      } else {
        // Jika parent bukan 'tabs' (kasus yang tidak diharapkan jika struktur benar), sembunyikan.
        setIsActiveTab(false);
      }
    };

    // Panggil updateVisibility saat komponen pertama kali di-mount
    updateVisibility();

    // Tambahkan listener untuk event 'transaction' editor.
    // Ini penting karena Tiptap tidak akan me-render ulang TabComponent
    // hanya karena atribut parent-nya berubah. Kita perlu secara manual
    // memeriksa ulang visibilitas setiap kali ada transaksi di editor
    // (termasuk saat atribut 'active' dari node 'tabs' diubah).
    const handleTransaction = () => {
      updateVisibility();
    };

    editor.on("transaction", handleTransaction);

    // Bersihkan listener saat komponen di-unmount
    return () => {
      editor.off("transaction", handleTransaction);
    };
  }, [editor, getPos, node.attrs]); // Depend pada editor, getPos, dan atribut node ini.

  return (
    <NodeViewWrapper
      // Gunakan state `isActiveTab` untuk mengontrol properti CSS `display`
      className={`tab-pane ${selected ? "is-selected" : ""} ${isActiveTab ? "block" : "hidden"} p-4`}
      data-tab-title={node.attrs.title} // Berguna untuk debugging atau inspeksi
    >
      {/* NodeViewContent akan me-render konten aktual dari node Tiptap 'tab' */}
      <NodeViewContent as="div" className="tab-content" />
    </NodeViewWrapper>
  );
}

// Komponen utama yang membungkus semua tab dan mengelola navigasi
export default function TabsComponent({ node, editor, getPos }: NodeViewProps) {
  // Mengambil semua node anak (yang seharusnya adalah node 'tab') dari node 'tabs'
  const tabs = node.content.content;

  // Mengambil status `active` dari atribut node 'tabs', atau default ke 0
  const [active, setActive] = useState(node.attrs.active || 0);

  // Gunakan useEffect untuk memastikan state `active` sinkron dengan atribut node
  // Ini penting jika ada perubahan `active` dari luar komponen (misalnya undo/redo)
  useEffect(() => {
    setActive(node.attrs.active || 0);
  }, [node.attrs.active]);

  // Fungsi untuk mengaktifkan tab tertentu
  const activateTab = (index: number) => {
    setActive(index);
    // Memperbarui atribut 'active' pada node 'tabs' di Tiptap editor
    // Ini penting agar state aktif persisten (misalnya saat simpan/muat dokumen)
    editor.commands.updateAttributes("tabs", { active: index });

    // Opsional: Fokuskan editor ke konten tab yang baru dipilih
    // Ini meningkatkan UX agar pengguna bisa langsung mengetik setelah mengganti tab
    // Perhitungan posisi node bisa sedikit rumit, tapi `getPos()` membantu
    let currentTabContentPos = getPos() + 1; // Posisi awal node 'tabs' + 1 (untuk masuk ke dalamnya)
    for (let i = 0; i < index; i++) {
      currentTabContentPos += tabs[i].nodeSize; // Tambahkan ukuran setiap tab sebelumnya
    }
    console.log("currentTabContentPos = ", currentTabContentPos);
    // currentTabContentPos sekarang adalah posisi awal dari node 'tab' yang aktif.
    // Tambahkan 1 lagi untuk masuk ke dalam konten node 'tab' itu sendiri.
    editor.commands.focus(currentTabContentPos + 1);
  };

  return (
    <NodeViewWrapper className="my-4">
      <div className="border rounded-xl overflow-hidden shadow-lg">
        {/* Header Tabs */}
        <div className="flex border-b bg-gray-100 dark:bg-gray-800">
          {tabs.map((tabNode, i) => {
            // Ambil judul dari atribut node 'tab'
            const title = tabNode.attrs?.title ?? `Tab ${i + 1}`;
            return (
              <button
                key={i}
                onClick={() => activateTab(i)}
                className={`flex-grow px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out
                  ${
                    i === active
                      ? "bg-white dark:bg-gray-900 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                {title}
              </button>
            );
          })}
        </div>

        {/* Konten Tabs - ini akan diisi oleh Tiptap yang merender TabComponent masing-masing */}
        {/* NodeViewContent di sini akan menjadi tempat Tiptap secara otomatis merender semua NodeView anak
            (yaitu, semua TabComponent yang dibuat dari node 'tab').
            Visibility (apakah tab itu terlihat atau tidak) kini dikontrol dari dalam setiap TabComponent itu sendiri. */}
        <div className="tab-content-wrapper">
          <NodeViewContent as="div" className="tiptap-tabs-container" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
// ```
// ---

// ### Penjelasan Perubahan di `TabComponent`:

// 1.  **Mengambil Data Parent**:
//     * Kita menggunakan `editor.state.doc.resolve(getPos())` untuk mendapatkan `ResolvedPos` dari node `tab` saat ini. Ini memberi kita akses ke informasi kontekstual tentang node di ProseMirror.
//     * Dari `$pos`, kita bisa mendapatkan `parentNode` (`$pos.parent`), yang seharusnya adalah node `tabs` kita.
//     * Kita kemudian membaca atribut `active` dari `parentNode.attrs.active`.
//     * Kita juga mendapatkan `currentTabIndex` (`$pos.index()`), yang merupakan indeks dari node `tab` ini di antara saudara-saudaranya.
// 2.  **Mengontrol Visibilitas**:
//     * Dengan membandingkan `currentTabIndex` dengan `parentActiveIndex`, kita bisa menentukan apakah tab ini harus ditampilkan atau disembunyikan.
//     * State `isActiveTab` digunakan untuk menambahkan kelas CSS `block` atau `hidden` (dengan asumsi Anda menggunakan Tailwind CSS) ke `NodeViewWrapper` dari `TabComponent`.
// 3.  **Mendengarkan Perubahan**:
//     * `useEffect` dengan `editor.on('transaction', handleTransaction)` sangat penting. Setiap kali ada perubahan di editor (termasuk saat Anda mengklik tombol tab dan `TabsComponent` memperbarui atribut `active` dari node `tabs`), listener ini akan terpicu.
//     * `TabComponent` kemudian akan menjalankan `updateVisibility()` lagi, mengevaluasi ulang apakah ia harus aktif atau tidak, dan memperbarui tampilannya.

// Dengan perubahan ini, `TabsComponent` bertanggung jawab untuk mengelola `active` state pada atribut node `tabs`, dan setiap `TabComponent` bertanggung jawab untuk membaca atribut tersebut dan menampilkan dirinya sendiri secara kondisional. Ini adalah cara yang kuat dan sesuai dengan filosofi Tiptap/ProseMirror untuk membangun fungsionalitas seperti t
