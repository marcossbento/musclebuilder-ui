import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AuthenticationResponse, AuthService } from './auth.service';
import { provideRouter, Router } from '@angular/router';
import { LoginRequest } from '../models/user.model';

// Funções para criar JWTs falsos (sem assinatura) com exp em segundos.
function base64UrlEncode(obj: any): string {
  const json = JSON.stringify(obj);
  const base64 = btoa(json);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function createJwtWithExp(expSeconds: number): string {
  const header = {alg: 'none', typ: 'JWT'};
  const payload = {exp: expSeconds};
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.`; // assinatura vazia
}

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AuthService,
        provideRouter([]),
      ]
    });

    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    localStorage.clear();

    spyOn(router, 'navigate').and.stub();

    (service as any).isAuthenticatedSubject.next(false);
    (service as any).logoutReason.next(null);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  })

  // Testes de login
  it('login() deve fazer POST para /api/auth/login, salvar tokens e emitir true em isAuthenticated$', (done: DoneFn) => {
    // ARRANGE: Dados de teste
    const credentials: LoginRequest = { email: 'test@test.com', password: 'Testpassword' };
    const tokens: AuthenticationResponse = { accessToken: 'fakeAccess', refreshToken: 'fakeRefresh' };

    // Escuta o observable, verificando o valor emitido
    const sub = service.isAuthenticated$.subscribe((v) => {
      if(v === true) {
        expect(localStorage.getItem('musclebuilder_access_token')).toBe('fakeAccess');
        expect(localStorage.getItem('musclebuilder_refresh_token')).toBe('fakeRefresh');
        sub.unsubscribe();
        done();
      }
    });

    // ACT: Chama o método a ser testado
    service.login(credentials).subscribe((response) => {
      // ASSERT: Verifica a response do método
      expect(response).toEqual(tokens);
    });

    // ASSERT Verificando a requisição HTTP
    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    // Simula a response do servidor
    req.flush(tokens);
  });

  it('login() retorna erro da API e não salva tokens', (done: DoneFn) => {
    // ARRANGE
    const credentials: LoginRequest = { email: 'test@test.com', password: 'secret' };

    // ACT
    service.login(credentials).subscribe({
      next: () => fail('O login deveria ter falhado com erro 401'),
      error: (err) => {
        // ASSERT
        expect(err.status).toBe(401);
        // Confirma que nada foi salvo no localStorage em caso de erro
        expect(localStorage.getItem('musclebuilder_access_token')).toBeNull();
        expect(localStorage.getItem('musclebuilder_refresh_token')).toBeNull();
        done();
      }
    });

    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  // TESTES DE LOGOUT
  it('logout() deve remover os tokens do localStorage, navegar para /auth e deixa isAuthenticated$ false', () => {
    // ARRANGE: Simula estado inicial de usuário logado
    localStorage.setItem('musclebuilder_access_token', 'fakeAccess');
    localStorage.setItem('musclebuilder_refresh_token', 'fakeRefresh');
    
    // Observa transição para false
    let last: boolean | undefined;
    const sub = service.isAuthenticated$.subscribe((v) => (last = v))

    // ACT
    service.logout('Test Reason');

    // ASSERT
    expect(localStorage.getItem('musclebuilder_access_token')).toBeNull;
    expect(localStorage.getItem('musclebuilder_refresh_token')).toBeNull;
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    expect(last).toBeFalse();

    sub.unsubscribe();
  });

  it('clearLogoutReason() zera o reason após setar no logout', () => {

    let latest: string | null = null;
    const sub = service.logoutReason$.subscribe((v) => (latest = v));

    service.logout('Sessão expirada');
    expect(latest!).toBe('Sessão expirada');

    service.clearLogoutReason();
    expect(latest).toBeNull();

    sub.unsubscribe();
  });

  // Getters simples
  it('getAccessToken() retorna o token salvo', () => {
    localStorage.setItem('musclebuilder_access_token', 'fakeAccess');
    expect(service.getAccessToken()).toBe('fakeAccess')
  });

  it('getRefreshToken() retorna o token salvo', () => {
    localStorage.setItem('musclebuilder_refresh_token', 'fakeRefresh');
    expect(service.getRefreshToken()).toBe('fakeRefresh')
  });

  // Testes de getIsAuthenticated
  it('getIsAuthenticated() retorna true quando há token não expirado', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    const token = createJwtWithExp(future);
    localStorage.setItem('musclebuilder_access_token', token);

    expect(service.getIsAuthenticated()).toBeTrue();
  });

  it('getIsAuthenticated() retorna false quando não há token', () => {
    localStorage.removeItem('musclebuilder_access_token');
    expect(service.getIsAuthenticated()).toBeFalse();
  });

  it('getIsAuthenticated() retorna false quando token está expirado', () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    const token = createJwtWithExp(past);
    localStorage.setItem('musclebuilder_access_token', token);

    expect(service.getIsAuthenticated()).toBeFalse();
  });

  // refreshToken
  it('refreshToken() faz POST e atualiza tokens, emitindo autenticado', (done: DoneFn) => {
    localStorage.setItem('musclebuilder_refresh_token', 'old-ref');
    const newTokens: AuthenticationResponse = { accessToken: 'new-acc', refreshToken: 'new-ref' };

    const sub = service.isAuthenticated$.subscribe((v) => {
      if (v === true) {
        expect(localStorage.getItem('musclebuilder_access_token')).toBe('new-acc');
        expect(localStorage.getItem('musclebuilder_refresh_token')).toBe('new-ref');
        sub.unsubscribe();
        done();
      }
    });

    service.refreshToken().subscribe((res) => {
      expect(res).toEqual(newTokens);
    });

    const req = http.expectOne('/api/auth/refresh');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: 'old-ref' });
    req.flush(newTokens);
  });

  it('refreshToken() falha quando não há refresh token e não chama API', (done: DoneFn) => {
    localStorage.removeItem('musclebuilder_refresh_token');

    service.refreshToken().subscribe({
      next: () => fail('Deveria falhar por ausência de refresh token'),
      error: (err) => {
        expect(String(err.message)).toContain('Refresh token');
        done();
      },
    });

    http.expectNone('/api/auth/refresh');
  });

  it('refreshToken() propaga erro quando API retorna erro (ex.: 401)', (done: DoneFn) => {
    localStorage.setItem('musclebuilder_refresh_token', 'old-ref');

    service.refreshToken().subscribe({
      next: () => fail('Deveria falhar'),
      error: (err) => {
        expect(err.status).toBe(401);
        done();
      },
    });

    const req = http.expectOne('/api/auth/refresh');
    expect(req.request.method).toBe('POST');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});

