import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Language = 'en' | 'es' | 'ru'
type ThemeMode = 'light' | 'dark' | 'system'

type Coordinates = {
  lat: string
  lon: string
}

type MapContext =
  | { entity: 'user'; label: string }
  | { entity: 'object'; label: string }
  | { entity: 'equipment'; label: string }
  | null

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'Maintenance & Monitoring',
    loginTitle: 'Sign in or create an account',
    identifier: 'Email or username',
    password: 'Password',
    register: 'Register',
    signIn: 'Sign in',
    logout: 'Logout',
    actionMenu: 'Actions',
    addUser: 'Add user',
    addObject: 'Add object',
    addEquipment: 'Add equipment',
    theme: 'Theme',
    language: 'Language',
    dashboard: 'Dashboard',
    userAnalytics: 'Users overview',
    objectAnalytics: 'Objects overview',
    equipmentAnalytics: 'Equipment overview',
    map: 'Map',
    openDrawer: 'Toggle navigation',
    create: 'Create',
    name: 'Name',
    contact: 'Contact',
    save: 'Save',
    cancel: 'Cancel',
    pickOnMap: 'Pick coordinates on map',
    latitude: 'Latitude',
    longitude: 'Longitude',
    mapHelper: 'Click on the map or type coordinates to attach them to the record.',
    close: 'Close',
    quickStats: 'Quick stats',
    navigate: 'Navigate to section',
    infoBlocksHint: 'Tap a block to jump to its screen.',
    objects: 'Objects',
    equipment: 'Equipment',
    users: 'Users',
  },
  es: {
    appName: 'Mantenimiento y Monitoreo',
    loginTitle: 'Inicia sesión o crea una cuenta',
    identifier: 'Correo o usuario',
    password: 'Contraseña',
    register: 'Registrarse',
    signIn: 'Entrar',
    logout: 'Salir',
    actionMenu: 'Acciones',
    addUser: 'Añadir usuario',
    addObject: 'Añadir objeto',
    addEquipment: 'Añadir equipo',
    theme: 'Tema',
    language: 'Idioma',
    dashboard: 'Panel',
    userAnalytics: 'Resumen de usuarios',
    objectAnalytics: 'Resumen de objetos',
    equipmentAnalytics: 'Resumen de equipos',
    map: 'Mapa',
    openDrawer: 'Alternar navegación',
    create: 'Crear',
    name: 'Nombre',
    contact: 'Contacto',
    save: 'Guardar',
    cancel: 'Cancelar',
    pickOnMap: 'Elegir coordenadas en el mapa',
    latitude: 'Latitud',
    longitude: 'Longitud',
    mapHelper: 'Haz clic en el mapa o escribe coordenadas para adjuntarlas al registro.',
    close: 'Cerrar',
    quickStats: 'Estadísticas rápidas',
    navigate: 'Ir a la sección',
    infoBlocksHint: 'Toca un bloque para ir a su pantalla.',
    objects: 'Objetos',
    equipment: 'Equipos',
    users: 'Usuarios',
  },
  ru: {
    appName: 'Сервисный портал',
    loginTitle: 'Вход или регистрация',
    identifier: 'E-mail или логин',
    password: 'Пароль',
    register: 'Регистрация',
    signIn: 'Войти',
    logout: 'Выйти',
    actionMenu: 'Действия',
    addUser: 'Добавить пользователя',
    addObject: 'Добавить объект',
    addEquipment: 'Добавить оборудование',
    theme: 'Тема',
    language: 'Язык',
    dashboard: 'Главная',
    userAnalytics: 'Пользователи',
    objectAnalytics: 'Объекты',
    equipmentAnalytics: 'Оборудование',
    map: 'Карта',
    openDrawer: 'Открыть меню',
    create: 'Создать',
    name: 'Название',
    contact: 'Контакт',
    save: 'Сохранить',
    cancel: 'Отмена',
    pickOnMap: 'Выбрать координаты на карте',
    latitude: 'Широта',
    longitude: 'Долгота',
    mapHelper: 'Нажмите на карту или введите координаты вручную.',
    close: 'Закрыть',
    quickStats: 'Быстрая аналитика',
    navigate: 'Перейти',
    infoBlocksHint: 'Нажмите на блок, чтобы открыть экран.',
    objects: 'Объекты',
    equipment: 'Оборудование',
    users: 'Пользователи',
  },
}

const preferredLanguage = (() => {
  const nav = navigator.language.slice(0, 2)
  if (nav === 'ru') return 'ru'
  if (nav === 'es') return 'es'
  return 'en'
})()

function useTheme(mode: ThemeMode) {
  useEffect(() => {
    const root = document.documentElement
    if (mode === 'system') {
      root.removeAttribute('data-theme')
      return
    }
    root.setAttribute('data-theme', mode)
  }, [mode])
}

function App() {
  const [language, setLanguage] = useState<Language>(preferredLanguage)
  const [theme, setTheme] = useState<ThemeMode>('system')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mapContext, setMapContext] = useState<MapContext>(null)
  const [coordinates, setCoordinates] = useState<Record<string, Coordinates>>({})

  const t = useMemo(() => translations[language], [language])

  useTheme(theme)

  const userSectionRef = useRef<HTMLDivElement>(null)
  const objectSectionRef = useRef<HTMLDivElement>(null)
  const equipmentSectionRef = useRef<HTMLDivElement>(null)
  const mapSectionRef = useRef<HTMLDivElement>(null)

  const quickStats = [
    {
      key: 'users',
      label: t.userAnalytics,
      count: 34,
      ref: userSectionRef,
    },
    {
      key: 'objects',
      label: t.objectAnalytics,
      count: 128,
      ref: objectSectionRef,
    },
    {
      key: 'equipment',
      label: t.equipmentAnalytics,
      count: 740,
      ref: equipmentSectionRef,
    },
    {
      key: 'map',
      label: t.map,
      count: 4,
      ref: mapSectionRef,
    },
  ]

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onApplyCoordinates = (coords: Coordinates) => {
    if (!mapContext) return
    setCoordinates((prev) => ({ ...prev, [mapContext.entity]: coords }))
    setMapContext(null)
  }

  const renderAuthOverlay = () => {
    if (isAuthenticated) return null
    return (
      <div className="auth-overlay">
        <div className="auth-card">
          <h2>{t.loginTitle}</h2>
          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              setIsAuthenticated(true)
            }}
          >
            <label>
              <span>{t.identifier}</span>
              <input name="identifier" placeholder={t.identifier} required />
            </label>
            <label>
              <span>{t.password}</span>
              <input name="password" type="password" placeholder={t.password} required />
            </label>
            <div className="auth-actions">
              <button type="submit" className="primary">
                {t.signIn}
              </button>
              <button type="button" onClick={() => setIsAuthenticated(true)}>
                {t.register}
              </button>
            </div>
            <p className="auth-hint">{t.infoBlocksHint}</p>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside
        className={`drawer ${drawerOpen ? 'open' : ''}`}
        onMouseEnter={() => setDrawerOpen(true)}
        onMouseLeave={() => setDrawerOpen(false)}
      >
        <div className="drawer-header">
          <span className="drawer-title">{t.dashboard}</span>
        </div>
        <nav className="drawer-nav">
          {quickStats.map((stat) => (
            <button key={stat.key} className="nav-link" onClick={() => scrollTo(stat.ref)}>
              <span>{stat.label}</span>
              <span className="pill">{stat.count}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <button
            className="icon-button"
            aria-label={t.openDrawer}
            onClick={() => setDrawerOpen((prev) => !prev)}
          >
            ☰
          </button>
          <div className="brand">{t.appName}</div>
          <div className="spacer" />
          <div className="control">
            <label>{t.theme}</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeMode)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div className="control">
            <label>{t.language}</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="ru">RU</option>
            </select>
          </div>
          <div className="menu">
            <button className="icon-button">⋮</button>
            <div className="menu-content">
              <button type="button">{t.addUser}</button>
              <button type="button">{t.addObject}</button>
              <button type="button">{t.addEquipment}</button>
            </div>
          </div>
          <button className="icon-button" onClick={() => setIsAuthenticated(false)}>
            {t.logout}
          </button>
        </header>

        <section className="hero">
          <div>
            <p className="eyebrow">{t.quickStats}</p>
            <h1>{t.appName}</h1>
            <p>{t.infoBlocksHint}</p>
          </div>
        </section>

        <section className="cards-grid">
          {quickStats.map((stat) => (
            <article key={stat.key} className="card" onClick={() => scrollTo(stat.ref)}>
              <p className="eyebrow">{t.navigate}</p>
              <h3>
                {stat.label} <span className="pill">{stat.count}</span>
              </h3>
              <p className="card-hint">{t.infoBlocksHint}</p>
            </article>
          ))}
        </section>

        <section className="panel" ref={userSectionRef}>
          <header className="panel-header">
            <div>
              <p className="eyebrow">{t.users}</p>
              <h2>{t.userAnalytics}</h2>
            </div>
            <button className="primary" onClick={() => setMapContext({ entity: 'user', label: t.users })}>
              {t.pickOnMap}
            </button>
          </header>
          <div className="panel-body">
            <form className="form-grid">
              <label>
                <span>{t.name}</span>
                <input placeholder={t.name} />
              </label>
              <label>
                <span>{t.contact}</span>
                <input placeholder={t.contact} />
              </label>
              <label>
                <span>{t.latitude}</span>
                <input
                  placeholder={t.latitude}
                  value={coordinates.user?.lat ?? ''}
                  onChange={(e) =>
                    setCoordinates((prev) => ({
                      ...prev,
                      user: { lat: e.target.value, lon: prev.user?.lon ?? '' },
                    }))
                  }
                />
              </label>
              <label>
                <span>{t.longitude}</span>
                <input
                  placeholder={t.longitude}
                  value={coordinates.user?.lon ?? ''}
                  onChange={(e) =>
                    setCoordinates((prev) => ({
                      ...prev,
                      user: { lon: e.target.value, lat: prev.user?.lat ?? '' },
                    }))
                  }
                />
              </label>
            </form>
            <div className="form-actions">
              <button className="primary">{t.save}</button>
              <button type="button">{t.cancel}</button>
            </div>
          </div>
        </section>

        <section className="panel" ref={objectSectionRef}>
          <header className="panel-header">
            <div>
              <p className="eyebrow">{t.objects}</p>
              <h2>{t.objectAnalytics}</h2>
            </div>
            <button
              className="primary"
              onClick={() => setMapContext({ entity: 'object', label: t.objects })}
            >
              {t.pickOnMap}
            </button>
          </header>
          <div className="panel-body">
            <form className="form-grid">
              <label>
                <span>{t.name}</span>
                <input placeholder={t.name} />
              </label>
              <label>
                <span>{t.contact}</span>
                <input placeholder={t.contact} />
              </label>
              <label>
                <span>{t.latitude}</span>
                <input
                  placeholder={t.latitude}
                  value={coordinates.object?.lat ?? ''}
                  onChange={(e) =>
                    setCoordinates((prev) => ({
                      ...prev,
                      object: { lat: e.target.value, lon: prev.object?.lon ?? '' },
                    }))
                  }
                />
              </label>
              <label>
                <span>{t.longitude}</span>
                <input
                  placeholder={t.longitude}
                  value={coordinates.object?.lon ?? ''}
                  onChange={(e) =>
                    setCoordinates((prev) => ({
                      ...prev,
                      object: { lon: e.target.value, lat: prev.object?.lat ?? '' },
                    }))
                  }
                />
              </label>
            </form>
            <div className="form-actions">
              <button className="primary">{t.save}</button>
              <button type="button">{t.cancel}</button>
            </div>
          </div>
        </section>

        <section className="panel" ref={equipmentSectionRef}>
          <header className="panel-header">
            <div>
              <p className="eyebrow">{t.equipment}</p>
              <h2>{t.equipmentAnalytics}</h2>
            </div>
            <button
              className="primary"
              onClick={() => setMapContext({ entity: 'equipment', label: t.equipment })}
            >
              {t.pickOnMap}
            </button>
          </header>
          <div className="panel-body">
            <form className="form-grid">
              <label>
                <span>Article</span>
                <input placeholder="Article" />
              </label>
              <label>
                <span>Serial</span>
                <input placeholder="Serial number" />
              </label>
              <label>
                <span>{t.latitude}</span>
                <input
                  placeholder={t.latitude}
                  value={coordinates.equipment?.lat ?? ''}
                  onChange={(e) =>
                    setCoordinates((prev) => ({
                      ...prev,
                      equipment: { lat: e.target.value, lon: prev.equipment?.lon ?? '' },
                    }))
                  }
                />
              </label>
              <label>
                <span>{t.longitude}</span>
                <input
                  placeholder={t.longitude}
                  value={coordinates.equipment?.lon ?? ''}
                  onChange={(e) =>
                    setCoordinates((prev) => ({
                      ...prev,
                      equipment: { lon: e.target.value, lat: prev.equipment?.lat ?? '' },
                    }))
                  }
                />
              </label>
            </form>
            <div className="form-actions">
              <button className="primary">{t.save}</button>
              <button type="button">{t.cancel}</button>
            </div>
          </div>
        </section>

        <section className="panel" ref={mapSectionRef}>
          <header className="panel-header">
            <div>
              <p className="eyebrow">{t.map}</p>
              <h2>{t.map}</h2>
            </div>
            <span className="badge">OpenStreetMap</span>
          </header>
          <div className="map-frame">
            <iframe
              title="OpenStreetMap"
              src="https://www.openstreetmap.org/export/embed.html?bbox=2.16%2C41.35%2C2.19%2C41.39&layer=mapnik"
              loading="lazy"
            />
          </div>
        </section>
      </main>

      {mapContext ? (
        <div className="map-modal" role="dialog" aria-modal="true">
          <div className="map-modal__card">
            <header className="map-modal__header">
              <h3>
                {t.map}: {mapContext.label}
              </h3>
              <button className="icon-button" onClick={() => setMapContext(null)}>
                {t.close}
              </button>
            </header>
            <p className="map-helper">{t.mapHelper}</p>
            <div className="map-modal__body">
              <div className="map-picker">
                <iframe
                  title="picker"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=37.60%2C55.74%2C37.70%2C55.80&layer=mapnik"
                />
              </div>
              <form
                className="form-grid"
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = new FormData(e.currentTarget)
                  onApplyCoordinates({
                    lat: String(form.get('lat') ?? ''),
                    lon: String(form.get('lon') ?? ''),
                  })
                }}
              >
                <label>
                  <span>{t.latitude}</span>
                  <input name="lat" placeholder={t.latitude} required />
                </label>
                <label>
                  <span>{t.longitude}</span>
                  <input name="lon" placeholder={t.longitude} required />
                </label>
                <div className="form-actions">
                  <button className="primary" type="submit">
                    {t.save}
                  </button>
                  <button type="button" onClick={() => setMapContext(null)}>
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {renderAuthOverlay()}
    </div>
  )
}

export default App
